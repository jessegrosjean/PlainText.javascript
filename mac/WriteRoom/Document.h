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
@end
