//
//  Document.m
//  Documents
//
//  Created by Jesse Grosjean on 3/12/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "Document.h"
#import "ODBEditorSuite.h"

@interface Document ()
- (void)sendClosedEventToExternalDocument;
- (void)sendModifiedEventToExternalWithDocument:(BOOL)fromSaveAs;
@end

@implementation Document

#pragma mark -
#pragma mark Init

- (id)init {
    self = [super init];
    encoding = NSUTF8StringEncoding;
    return self;
}

#pragma mark -
#pragma mark dealloc

- (void)dealloc {
	[externalDisplayName release];
	[externalSender release];
	[externalToken release];
	[lastReadString release];
	[jsDocument release];
	[webView setFrameLoadDelegate:nil];
	[super dealloc];
}

- (void)close {
	if (fromExternal == YES) {
		[self sendClosedEventToExternalDocument];
	}	
	[super close];
}

#pragma mark -
#pragma mark Window Controllers

- (NSString *)windowNibName {
	return @"DocumentWindow";
}

- (void)windowControllerDidLoadNib:(NSWindowController *)windowController {
	[super windowControllerDidLoadNib:windowController];
	
	[[webView window] setAlphaValue:0.0];
	[webView setFrameLoadDelegate:self];
	[webView setMaintainsBackForwardList:NO];
	[[webView mainFrame] loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:[[[NSBundle mainBundle] pathForResource:@"ace" ofType:@""] stringByAppendingPathComponent:@"editor.html"]]]];
}

#pragma mark -
#pragma mark WebView Frame Load Delegate

- (void)webView:(WebView *)sender didFinishLoadForFrame:(WebFrame *)frame {
	[jsDocument autorelease];
	jsDocument = [[[webView windowScriptObject] evaluateWebScript:@"editor.session.getDocument()"] retain];

	if (lastReadString) {
		[jsDocument callWebScriptMethod:@"setValue" withArguments:[NSArray arrayWithObject:lastReadString]];
	}

	[[webView window] setAlphaValue:1.0];
	[[webView window] makeKeyAndOrderFront:nil];
}

#pragma mark -
#pragma mark Read / Write

- (BOOL)readFromURL:(NSURL *)absoluteURL ofType:(NSString *)typeName error:(NSError **)outError {
	[lastReadString release];
	lastReadString = [[NSString stringWithContentsOfURL:absoluteURL encoding:encoding error:outError] retain];
	if (!lastReadString) {
		lastReadString = [[NSString stringWithContentsOfURL:absoluteURL usedEncoding:&encoding error:outError] retain];
	}
	
	if (lastReadString) {
		NSAppleEventDescriptor *appleEventDescriptor = [[NSAppleEventManager sharedAppleEventManager] currentAppleEvent];
		NSAppleEventDescriptor *keyAEPropDataDescriptor = nil;
		BOOL isKeyAEPropData = NO;

		if ([appleEventDescriptor paramDescriptorForKeyword:keyFileSender]) {
			fromExternal = YES;
		}
		
		if (!fromExternal && [appleEventDescriptor paramDescriptorForKeyword:keyAEPropData]) {
			keyAEPropDataDescriptor = [appleEventDescriptor paramDescriptorForKeyword:keyAEPropData];
			isKeyAEPropData = YES;
			
			if ([keyAEPropDataDescriptor paramDescriptorForKeyword:keyFileSender]) {
				fromExternal = YES;
			}
		}
		
		if (fromExternal) {
			if (!isKeyAEPropData) {
				externalDisplayName = [[[appleEventDescriptor paramDescriptorForKeyword:keyFileCustomPath] stringValue] retain];
			} else {
				externalDisplayName = [[[keyAEPropDataDescriptor paramDescriptorForKeyword:keyFileCustomPath] stringValue] retain];
			}
			
			if (!isKeyAEPropData) {
				externalSender = [[appleEventDescriptor paramDescriptorForKeyword:keyFileSender] retain];
			} else {
				externalSender = [[keyAEPropDataDescriptor paramDescriptorForKeyword:keyFileSender] retain];
			}
			
			if (!isKeyAEPropData) {
				externalToken = [[appleEventDescriptor paramDescriptorForKeyword:keyFileSenderToken] retain];
			} else {
				externalToken = [[keyAEPropDataDescriptor paramDescriptorForKeyword:keyFileSenderToken] retain];
			}
		}

		return YES;
	}
	
	return NO;
}

- (BOOL)saveToURL:(NSURL *)absoluteURL ofType:(NSString *)typeName forSaveOperation:(NSSaveOperationType)saveOperation error:(NSError **)outError {
	BOOL success = [super saveToURL:absoluteURL ofType:typeName forSaveOperation:saveOperation error:outError];
	
	if (success && saveOperation != NSAutosaveOperation && saveOperation != NSSaveToOperation) {
		if (fromExternal) {
			[self sendModifiedEventToExternalWithDocument:saveOperation == NSSaveAsOperation];
		}
	}
	
	return success;
}

- (BOOL)writeToURL:(NSURL *)absoluteURL ofType:(NSString *)typeName forSaveOperation:(NSSaveOperationType)saveOperation originalContentsURL:(NSURL *)absoluteOriginalContentsURL error:(NSError **)outError {
	[lastReadString release];
	lastReadString = [[jsDocument callWebScriptMethod:@"getValue" withArguments:[NSArray array]] retain];
	return [lastReadString writeToURL:absoluteURL atomically:YES encoding:encoding error:outError];
}

#pragma mark -
#pragma mark ODB Editor Suite support

- (NSString *)displayName {
	if (fromExternal && externalDisplayName != nil) {
		return externalDisplayName;
	}
	return [super displayName];
}

- (void)sendModifiedEventToExternalWithDocument:(BOOL)fromSaveAs {
	NSURL *fileURL = [self fileURL];
	FSSpec fsSpec;
	FSSpec fsSpecSaveAs;
	FSRef fsRef;
	FSRef fsRefSaveAs;
	
	if (CFURLGetFSRef((CFURLRef)fileURL, &fsRef) == true) {
		if (FSGetCatalogInfo(&fsRef, kFSCatInfoNone, NULL, NULL, &fsSpec, NULL) != noErr) {
			return;
		}
	}
	
	if (fromSaveAs) {
		if (CFURLGetFSRef((CFURLRef)fileURL, &fsRefSaveAs) == true) {
			if (FSGetCatalogInfo(&fsRefSaveAs, kFSCatInfoNone, NULL, NULL, &fsSpecSaveAs, NULL) != noErr) {
				return;
			}
		}
	}
	
	OSType signature = [externalSender typeCodeValue];
	NSAppleEventDescriptor *descriptor = [NSAppleEventDescriptor descriptorWithDescriptorType:typeApplSignature bytes:&signature length:sizeof(OSType)];
	NSAppleEventDescriptor *event = [NSAppleEventDescriptor appleEventWithEventClass:kODBEditorSuite eventID:kAEModifiedFile targetDescriptor:descriptor returnID:kAutoGenerateReturnID transactionID:kAnyTransactionID];
	[event setParamDescriptor:[NSAppleEventDescriptor descriptorWithDescriptorType:'fss ' bytes:&fsSpec length:sizeof(FSSpec)] forKeyword:keyDirectObject];
	if (externalToken) {
		[event setParamDescriptor:externalToken forKeyword:keySenderToken];
	}
	if (fromSaveAs) {
		[descriptor setParamDescriptor:[NSAppleEventDescriptor descriptorWithDescriptorType:'fss ' bytes:&fsSpecSaveAs length:sizeof(FSSpec)] forKeyword:keyNewLocation];
		fromExternal = NO;
	}
	
	AppleEvent *eventPointer = (AEDesc *)[event aeDesc];
	
	if (eventPointer) {
		OSStatus errorStatus = AESendMessage(eventPointer, NULL, kAENoReply, kAEDefaultTimeout);
		if (errorStatus != noErr) {
			NSBeep();
		}
	}
}

- (void)sendClosedEventToExternalDocument {
	NSURL *url = [self fileURL];
	FSSpec fsSpec;
	FSRef fsRef;
	
	if (CFURLGetFSRef((CFURLRef)url, &fsRef) == true) {
		if (FSGetCatalogInfo(&fsRef, kFSCatInfoNone, NULL, NULL, &fsSpec, NULL) != noErr) {
			return;
		}
	}
	
	OSType signature = [externalSender typeCodeValue];
	NSAppleEventDescriptor *descriptor = [NSAppleEventDescriptor descriptorWithDescriptorType:typeApplSignature bytes:&signature length:sizeof(OSType)];
	NSAppleEventDescriptor *event = [NSAppleEventDescriptor appleEventWithEventClass:kODBEditorSuite eventID:kAEClosedFile targetDescriptor:descriptor returnID:kAutoGenerateReturnID transactionID:kAnyTransactionID];
	[event setParamDescriptor:[NSAppleEventDescriptor descriptorWithDescriptorType:'fss ' bytes:&fsSpec length:sizeof(FSSpec)] forKeyword:keyDirectObject];
	if (externalToken) {
		[event setParamDescriptor:externalToken forKeyword:keySenderToken];
	}
	
	AppleEvent *eventPointer = (AEDesc *)[event aeDesc];
	
	if (eventPointer) {
		OSStatus errorStatus = AESendMessage(eventPointer, NULL, kAENoReply, kAEDefaultTimeout);
		if (errorStatus != noErr) {
			NSBeep();
		}
	}
}

@end
