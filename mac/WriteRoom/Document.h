//
//  Document.h
//  Documents
//
//  Created by Jesse Grosjean on 3/12/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//


@class DocumentWebView;

@interface Document : NSDocument {
	IBOutlet DocumentWebView *webView;

	BOOL fromExternal;
	NSString *externalDisplayName;
	NSAppleEventDescriptor *externalSender;
	NSAppleEventDescriptor *externalToken;
	NSStringEncoding encoding;
	NSString *lastReadString;
}

- (IBAction)strong:(id)sender;
- (IBAction)em:(id)sender;
- (IBAction)underline:(id)sender;
- (IBAction)bigger:(id)sender;
- (IBAction)smaller:(id)sender;
- (IBAction)toggleFullSingleScreen:(id)sender;
- (IBAction)toggleFullAllScreens:(id)sender;

@end
