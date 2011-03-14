//
//  Document.m
//  Documents
//
//  Created by Jesse Grosjean on 3/12/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "Document.h"
#import "ODBEditorSuite.h"
#import "DocumentWebView.h"


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
	[self setUndoManager:nil];
    return self;
}

#pragma mark -
#pragma mark dealloc

- (void)dealloc {
	[externalDisplayName release];
	[externalSender release];
	[externalToken release];
	[lastReadString release];
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
	[[webView mainFrame] loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:[[[NSBundle mainBundle] pathForResource:@"writeroom" ofType:@""] stringByAppendingPathComponent:@"editor.html"]]]];
}

#pragma mark -
#pragma mark WebView Frame Load Delegate

- (void)webView:(WebView *)sender didFinishLoadForFrame:(WebFrame *)frame {
	if (lastReadString) {
		self.textContent = lastReadString;
	} else {
		lastReadString = @"";
	}
		
	[[webView window] setAlphaValue:1.0];
	[[webView window] makeKeyAndOrderFront:nil];
}

#pragma mark -
#pragma mark Actions

- (BOOL)isDocumentEdited {
	NSString *current = [webView.jsDocument callWebScriptMethod:@"getValue" withArguments:[NSArray array]];
	return current != lastReadString && ![lastReadString isEqualToString:current];
}

- (void)updateChangeCount:(NSDocumentChangeType)change {
	[super updateChangeCount:change];
}

- (IBAction)undo:(id)sender {
	[webView.jsUndoManager callWebScriptMethod:@"undo" withArguments:[NSArray array]];
}

- (IBAction)redo:(id)sender {
	[webView.jsUndoManager callWebScriptMethod:@"redo" withArguments:[NSArray array]];
}

- (IBAction)strong:(id)sender {
	[webView.jsEditor callWebScriptMethod:@"strong" withArguments:[NSArray array]];
}

- (IBAction)em:(id)sender {
	[webView.jsEditor callWebScriptMethod:@"em" withArguments:[NSArray array]];
}

- (IBAction)underline:(id)sender {	
	[webView.jsEditor callWebScriptMethod:@"underline" withArguments:[NSArray array]];
}

- (IBAction)bigger:(id)sender {
}

- (IBAction)smaller:(id)sender {
}

- (NSUInteger)countOfWindowsInFullScreenMode {
	NSInteger result = 0;
	
	for (NSWindow *each in [NSApp windows]) {
		if ([[each contentView] isInFullScreenMode]) {
			result++;
		}
	}
	
	return result;
}

- (void)toggleFullScreenMode:(BOOL)allScreens {
	CGFloat red, green, blue = 0;
	CGDisplayFadeReservationToken reservationToken;

	[[[NSColor blackColor] colorUsingColorSpaceName:NSDeviceRGBColorSpace] getRed:&red green:&green blue:&blue alpha:nil];

	if ([webView isInFullScreenMode]) {
		BOOL shouldFade = [self countOfWindowsInFullScreenMode] == 1;

		if (shouldFade) {
			CGAcquireDisplayFadeReservation(kCGMaxDisplayReservationInterval, &reservationToken);
			CGDisplayFade(reservationToken, 0.3, kCGDisplayBlendNormal, kCGDisplayBlendSolidColor, red, green, blue, true);
		}
		
		[webView exitFullScreenModeWithOptions:nil];
		//[webView.jsRenderer callWebScriptMethod:@"setPadding" withArguments:[NSArray arrayWithObject:@"4"]];
		
		if (shouldFade) {
			CGDisplayFade(reservationToken, 0.3, kCGDisplayBlendSolidColor, kCGDisplayBlendNormal, red, green, blue, false);
			CGReleaseDisplayFadeReservation(reservationToken);
		}
	} else {
		BOOL shouldFade = [self countOfWindowsInFullScreenMode] == 0;

		if (shouldFade) {
			CGAcquireDisplayFadeReservation(kCGMaxDisplayReservationInterval, &reservationToken);
			CGDisplayFade(reservationToken, 0.3, kCGDisplayBlendNormal, kCGDisplayBlendSolidColor, red, green, blue, true);
		}
		
		[webView enterFullScreenMode:[NSScreen mainScreen] withOptions:
		 [NSDictionary dictionaryWithObjectsAndKeys:
		  [NSNumber numberWithBool:allScreens], NSFullScreenModeAllScreens,
		  [NSNumber numberWithInteger:NSApplicationPresentationHideDock | NSApplicationPresentationAutoHideMenuBar], NSFullScreenModeApplicationPresentationOptions, nil]];
		
		//CGFloat characterWidth = [[webView.jsRenderer valueForKey:@"characterWidth"] floatValue];
		//CGFloat screenWidth = [[NSScreen mainScreen] frame].size.width;
		//CGFloat documentWidth = characterWidth * 80;
		//[webView.jsRenderer callWebScriptMethod:@"setPadding" withArguments:[NSArray arrayWithObject:[NSNumber numberWithFloat:screenWidth - documentWidth]]];

		if (shouldFade) {
			CGDisplayFade(reservationToken, 0.3, kCGDisplayBlendSolidColor, kCGDisplayBlendNormal, red, green, blue, false);
			CGReleaseDisplayFadeReservation(reservationToken);
		}
	}
	
	// Not sure why, but if don't do this then can't type after enter/exit of fullscreen mode.
	[webView.jsEditor callWebScriptMethod:@"blur" withArguments:[NSArray array]];
	[webView.jsEditor callWebScriptMethod:@"focus" withArguments:[NSArray array]];
}

- (IBAction)toggleFullSingleScreen:(id)sender {
	[self toggleFullScreenMode:NO];
}

- (IBAction)toggleFullAllScreens:(id)sender {
	[self toggleFullScreenMode:YES];
}

- (BOOL)validateMenuItem:(NSMenuItem *)item {
	SEL action = [item action];
	
    if (action == @selector(undo:)) {
		return [[webView.jsUndoManager callWebScriptMethod:@"hasUndo" withArguments:[NSArray array]] boolValue];
	} else if (action == @selector(redo:)) {
		return [[webView.jsUndoManager callWebScriptMethod:@"hasRedo" withArguments:[NSArray array]] boolValue];
	} else if (action == @selector(strong:) || action == @selector(em:) || action == @selector(underline:)) {
		return ![[webView.jsSelection callWebScriptMethod:@"isEmpty" withArguments:[NSArray array]] boolValue];
	} else if (action == @selector(toggleFullSingleScreen:)) {
		if ([webView isInFullScreenMode]) {
			[item setTitle:NSLocalizedString(@"Exit Full Screen", nil)];
		} else {
			[item setTitle:NSLocalizedString(@"Enter Full Screen", nil)];
		}
		return YES;
	} else if (action == @selector(toggleFullAllScreens:)) {
		if ([webView isInFullScreenMode]) {
			[item setTitle:NSLocalizedString(@"Exit Full Screen", nil)];
		} else {
			[item setTitle:NSLocalizedString(@"Enter Full Screen All", nil)];
		}
		return YES;
	}	
	return YES;
}

#pragma mark -
#pragma mark Printing

- (NSPrintOperation *)printOperationWithSettings:(NSDictionary *)settings error:(NSError **)error {
	NSPrintInfo *printInfo = [self printInfo];
	[printInfo setVerticallyCentered:NO];
	[[printInfo dictionary] setValue:[NSNumber numberWithBool:YES] forKey:NSPrintHeaderAndFooter];
	[[printInfo dictionary] addEntriesFromDictionary:settings];
	
	NSTextView *printView = [[[NSTextView alloc] initWithFrame:[printInfo imageablePageBounds]] autorelease];
	[printView setRichText:NO];
	[[[printView textStorage] mutableString] appendString:self.textContent];
	
    NSPrintOperation *printOperation = [NSPrintOperation printOperationWithView:printView printInfo:printInfo];
	[printOperation setJobTitle:[self displayName]];
	return printOperation;
}

#pragma mark -
#pragma mark Read / Write

- (NSString *)textContent {
	return [webView.jsDocument callWebScriptMethod:@"getValue" withArguments:[NSArray array]];
}

- (void)setTextContent:(NSString *)textContent {
	[webView.jsDocument callWebScriptMethod:@"setValue" withArguments:[NSArray arrayWithObject:textContent]];
}

- (BOOL)readFromURL:(NSURL *)absoluteURL ofType:(NSString *)typeName error:(NSError **)outError {
	[lastReadString release];
	lastReadString = [[NSString stringWithContentsOfURL:absoluteURL encoding:encoding error:outError] retain];
	if (!lastReadString) {
		lastReadString = [[NSString stringWithContentsOfURL:absoluteURL usedEncoding:&encoding error:outError] retain];
	}
	
	if (lastReadString) {
		self.textContent = lastReadString;
		
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
	lastReadString = [self.textContent retain];
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
