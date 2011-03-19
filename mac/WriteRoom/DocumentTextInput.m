//
//  DocumentTextInput.m
//  WriteRoom
//
//  Created by Jesse Grosjean on 3/18/11.
//  Copyright 2011 Hog Bay Software. All rights reserved.
//

#import "DocumentTextInput.h"
#import "DocumentWebView.h"


@implementation DocumentTextInput

- (id)initWithFrame:(NSRect)frame {
    self = [super initWithFrame:frame];
    return self;
}

- (void)dealloc {
    [super dealloc];
}

#pragma mark -

- (BOOL)acceptsFirstResponder {
    return YES;
}

- (BOOL)becomeFirstResponder {
    return YES;
}

- (BOOL)resignFirstResponder {
    return YES;
}

- (void)keyDown:(NSEvent *)theEvent {
    [[self inputContext] handleEvent:theEvent];
}

- (void)mouseDown:(NSEvent *)theEvent {
    [[self inputContext] handleEvent:theEvent];
}

- (void)mouseDragged:(NSEvent *)theEvent {
    [[self inputContext] handleEvent:theEvent];
}

- (void)mouseUp:(NSEvent *)theEvent {
    [[self inputContext] handleEvent:theEvent];
}

#pragma mark -

- (void)doCommandBySelector:(SEL)aSelector {
	
	if (aSelector == @selector(deleteBackward:)) {
		[[webView jsEditor] callWebScriptMethod:@"removeLeft" withArguments:[NSArray array]];
	} else if (aSelector == @selector(deleteForward:)) {
		[[webView jsEditor] callWebScriptMethod:@"removeRight" withArguments:[NSArray array]];
	} else if (aSelector == @selector(insertNewline:) || aSelector == @selector(insertNewlineIgnoringFieldEditor:)) {
		[[webView jsEditor] callWebScriptMethod:@"insert" withArguments:[NSArray arrayWithObject:@"\n"]];
	} else if (aSelector == @selector(moveLeft:)) {
		[[webView jsEditor] callWebScriptMethod:@"navigateLeft" withArguments:[NSArray array]];
	} else if (aSelector == @selector(moveLeftAndModifySelection:)) {
		[[webView jsSelection] callWebScriptMethod:@"selectLeft" withArguments:[NSArray array]];
	} else if (aSelector == @selector(moveRight:)) {
		[[webView jsEditor] callWebScriptMethod:@"navigateRight" withArguments:[NSArray array]];
	} else if (aSelector == @selector(moveRightAndModifySelection:)) {
		[[webView jsSelection] callWebScriptMethod:@"selectRight" withArguments:[NSArray array]];
	} else if (aSelector == @selector(moveUp:)) {
		[[webView jsEditor] callWebScriptMethod:@"navigateUp" withArguments:[NSArray array]];
	} else if (aSelector == @selector(moveUpAndModifySelection:)) {
		[[webView jsSelection] callWebScriptMethod:@"selectUp" withArguments:[NSArray array]];
	} else if (aSelector == @selector(moveDown:)) {
		[[webView jsEditor] callWebScriptMethod:@"navigateDown" withArguments:[NSArray array]];
	} else if (aSelector == @selector(moveDownAndModifySelection:)) {
		[[webView jsSelection] callWebScriptMethod:@"selectDown" withArguments:[NSArray array]];

	} else if (aSelector == @selector(moveToLeftEndOfLine:)) {
		[[webView jsEditor] callWebScriptMethod:@"navigateLineStart" withArguments:[NSArray array]];

		
	} else if (aSelector == @selector(moveWordLeft:)) {
		[[webView jsEditor] callWebScriptMethod:@"navigateWordLeft" withArguments:[NSArray array]];
	} else if (aSelector == @selector(moveWordRight:)) {
		[[webView jsEditor] callWebScriptMethod:@"navigateWordRight" withArguments:[NSArray array]];
	} else if (aSelector == @selector(selectAll:)) {
		[[webView jsEditor] callWebScriptMethod:@"selectAll" withArguments:[NSArray array]];
	} else {
		NSLog(NSStringFromSelector(aSelector), nil);
		NSBeep();
		[super doCommandBySelector:aSelector]; // NSResponder's implementation will do nicely
	}
}

- (void)insertText:(id)aString replacementRange:(NSRange)replacementRange {
	[[webView jsEditor] callWebScriptMethod:@"insert" withArguments:[NSArray arrayWithObject:aString]];
    [self unmarkText];
    [[self inputContext] invalidateCharacterCoordinates]; // recentering
}

- (void)setMarkedText:(id)aString selectedRange:(NSRange)newSelection replacementRange:(NSRange)replacementRange {
	if (replacementRange.location == NSNotFound) {
        if (markedRange.location != NSNotFound) {
            replacementRange = markedRange;
        } else {
            replacementRange = selectedRange;
        }
    }
	
    // Add the text
    if ([(NSString *)aString length] == 0) {
        [backingStore deleteCharactersInRange:replacementRange];
        [self unmarkText];
    } else {
        markedRange = NSMakeRange(replacementRange.location, [(NSString *)aString length]);
        if ([aString isKindOfClass:[NSAttributedString class]]) {
            [backingStore replaceCharactersInRange:replacementRange withString:[aString string]];
        } else {
            [backingStore replaceCharactersInRange:replacementRange withString:aString];
        }
    }
    
    // Redisplay
    selectedRange.location = replacementRange.location + newSelection.location; // Just for now, only select the marked text
    selectedRange.length = newSelection.length;
    [[self inputContext] invalidateCharacterCoordinates]; // recentering
    [self setNeedsDisplay:YES];
}

- (void)unmarkText {
    markedRange = NSMakeRange(NSNotFound, 0);
    [[self inputContext] discardMarkedText];
}

- (NSRange)selectedRange {
    return selectedRange;
}

- (NSRange)markedRange {
    return markedRange;
}

- (BOOL)hasMarkedText {
    return (markedRange.location == NSNotFound ? NO : YES);
}

- (NSAttributedString *)attributedSubstringForProposedRange:(NSRange)aRange actualRange:(NSRangePointer)actualRange {
    if (actualRange) {
        *actualRange = aRange;
    }
	return [[[NSAttributedString alloc] initWithString:[backingStore substringWithRange:aRange]] autorelease];
}

- (NSArray *)validAttributesForMarkedText {
    // We only allow these attributes to be set on our marked text (plus standard attributes)
    // NSMarkedClauseSegmentAttributeName is important for CJK input, among other uses
    // NSGlyphInfoAttributeName allows alternate forms of characters
    return [NSArray arrayWithObjects:NSMarkedClauseSegmentAttributeName, NSGlyphInfoAttributeName, nil];
}

- (NSRect)firstRectForCharacterRange:(NSRange)aRange actualRange:(NSRangePointer)actualRange {
	return NSZeroRect;
}

- (NSUInteger)characterIndexForPoint:(NSPoint)aPoint {
	return 0;
}

@end
