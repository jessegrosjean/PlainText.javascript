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
    [super dealloc];
}

#pragma mark -
#pragma mark Attributes

- (WebScriptObject *)jsDocument {
	if (!jsDocument) {
		jsDocument = [[self.jsSession callWebScriptMethod:@"getDocument" withArguments:[NSArray array]] retain];
	}
	return jsDocument;
}

- (WebScriptObject *)jsSession {
	if (!jsSession) {
		jsSession = [[self.jsEditor callWebScriptMethod:@"getSession" withArguments:[NSArray array]] retain];
	}
	return jsSession;
}

- (WebScriptObject *)jsUndoManager {
	if (!jsUndoManager) {
		jsUndoManager = [[self.jsSession callWebScriptMethod:@"getUndoManager" withArguments:[NSArray array]] retain];
	}
	return jsUndoManager;
}

- (WebScriptObject *)jsEditor {
	if (!jsEditor) {
		jsEditor = [[[self windowScriptObject] evaluateWebScript:@"editor"] retain];
	}
	return jsEditor;
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
