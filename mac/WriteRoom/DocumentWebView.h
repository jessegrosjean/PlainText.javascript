//
//  DocumentWebView.h
//  WriteRoom
//
//  Created by Jesse Grosjean on 3/12/11.
//  Copyright 2011 Hog Bay Software. All rights reserved.
//


@interface DocumentWebView : WebView {
	WebScriptObject *jsDocument;
	WebScriptObject *jsSession;
	WebScriptObject *jsUndoManager;
	WebScriptObject *jsEditor;
}

@property(nonatomic, readonly) WebScriptObject *jsDocument;
@property(nonatomic, readonly) WebScriptObject *jsSession;
@property(nonatomic, readonly) WebScriptObject *jsUndoManager;
@property(nonatomic, readonly) WebScriptObject *jsEditor;

@end
