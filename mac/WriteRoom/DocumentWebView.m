//
//  DocumentWebView.m
//  WriteRoom
//
//  Created by Jesse Grosjean on 3/12/11.
//  Copyright 2011 Hog Bay Software. All rights reserved.
//

#import "DocumentWebView.h"


@implementation DocumentWebView

- (id)init {
    self = [super init];
    return self;
}

- (void)dealloc {
	[jsDocument release];
	[jsUndoManager release];
    [super dealloc];
}

- (WebScriptObject *)jsDocument {
	if (!jsDocument) {
		jsDocument = [[[self windowScriptObject] evaluateWebScript:@"editor.session.getDocument()"] retain];
	}
	return jsDocument;
}

- (WebScriptObject *)jsUndoManager {
	if (!jsUndoManager) {
		jsUndoManager = [[[self windowScriptObject] evaluateWebScript:@"editor.session.getUndoManager()"] retain];
	}
	return jsUndoManager;
}

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
	return [super validateMenuItem:item];
}

@end
