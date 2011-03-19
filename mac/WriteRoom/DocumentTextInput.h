//
//  DocumentTextInput.h
//  WriteRoom
//
//  Created by Jesse Grosjean on 3/18/11.
//  Copyright 2011 Hog Bay Software. All rights reserved.
//

#import <Cocoa/Cocoa.h>


@class DocumentWebView;

@interface DocumentTextInput : NSView <NSTextInputClient> {
	IBOutlet DocumentWebView *webView;
	
    NSRange markedRange;
    NSRange selectedRange;
	NSMutableString *backingStore;
}

@end
