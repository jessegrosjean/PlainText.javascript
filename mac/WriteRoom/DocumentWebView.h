//
//  DocumentWebView.h
//  WriteRoom
//
//  Created by Jesse Grosjean on 3/12/11.
//  Copyright 2011 Hog Bay Software. All rights reserved.
//


@interface DocumentWebView : WebView <NSTextViewDelegate, NSTextStorageDelegate> {
	WebScriptObject *jsDocument;
	WebScriptObject *jsSession;
	WebScriptObject *jsUndoManager;
	WebScriptObject *jsEditor;
	WebScriptObject *jsSelection;
	WebScriptObject *jsRenderer;
}

@property(nonatomic, readonly) WebScriptObject *jsDocument;
@property(nonatomic, readonly) WebScriptObject *jsSession;
@property(nonatomic, readonly) WebScriptObject *jsUndoManager;
@property(nonatomic, readonly) WebScriptObject *jsEditor;
@property(nonatomic, readonly) WebScriptObject *jsSelection;
@property(nonatomic, readonly) WebScriptObject *jsRenderer;

@end
