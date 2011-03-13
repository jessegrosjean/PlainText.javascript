//
//  DocumentWebView.m
//  WriteRoom
//
//  Created by Jesse Grosjean on 3/12/11.
//  Copyright 2011 Hog Bay Software. All rights reserved.
//

#import "DocumentWebView.h"


@implementation DocumentWebView

#pragma mark -
#pragma mark initialize

+ (void)initialize {
	[[NSUserDefaults standardUserDefaults] registerDefaults:[NSDictionary dictionaryWithObjectsAndKeys:
															 [NSNumber numberWithBool:YES], @"WebKitDeveloperExtras",
															 nil]];
}


#pragma mark -
#pragma mark Init

- (id)init {
    self = [super init];
    return self;
}

#pragma mark -
#pragma mark Dealloc

- (void)dealloc {
	[jsDocument release];
	[jsSession release];
	[jsUndoManager release];
	[jsEditor release];
	[jsSelection release];
    [super dealloc];
}

#pragma mark -
#pragma mark Attributes

- (id)nilIfIsWebUndefined:(id)anObject {
	if ([anObject isKindOfClass:[WebUndefined class]]) {
		return nil;
	} else {
		return anObject;
	}
}

- (WebScriptObject *)jsDocument {
	if (!jsDocument) {
		jsDocument = [[self nilIfIsWebUndefined:[self.jsSession callWebScriptMethod:@"getDocument" withArguments:[NSArray array]]] retain];
	}
	return jsDocument;
}

- (WebScriptObject *)jsSession {
	if (!jsSession) {
		jsSession = [[self nilIfIsWebUndefined:[self.jsEditor callWebScriptMethod:@"getSession" withArguments:[NSArray array]]] retain];
	}
	return jsSession;
}

- (WebScriptObject *)jsUndoManager {
	if (!jsUndoManager) {
		jsUndoManager = [[self nilIfIsWebUndefined:[self.jsSession callWebScriptMethod:@"getUndoManager" withArguments:[NSArray array]]] retain];
	}
	return jsUndoManager;
}

- (WebScriptObject *)jsEditor {
	if (!jsEditor) {
		jsEditor = [[self nilIfIsWebUndefined:[[self windowScriptObject] evaluateWebScript:@"editor"]] retain];
	}
	return jsEditor;
}

- (WebScriptObject *)jsSelection {
	if (!jsSelection) {
		jsSelection = [[self nilIfIsWebUndefined:[self.jsEditor callWebScriptMethod:@"getSelection" withArguments:[NSArray array]]] retain];
	}
	return jsSelection;
}

#pragma mark -
#pragma mark Actions

- (IBAction)undo:(id)sender {
	[self.jsUndoManager callWebScriptMethod:@"undo" withArguments:[NSArray array]];
}

- (IBAction)redo:(id)sender {
	[self.jsUndoManager callWebScriptMethod:@"redo" withArguments:[NSArray array]];
}

- (BOOL)validateMenuItem:(NSMenuItem *)item {
    if ([item action] == @selector(undo:)) {
		return [[self.jsUndoManager callWebScriptMethod:@"hasUndo" withArguments:[NSArray array]] boolValue];
	} else if ([item action] == @selector(redo:)) {
		return [[self.jsUndoManager callWebScriptMethod:@"hasRedo" withArguments:[NSArray array]] boolValue];
	}
	return YES;
}

@end
