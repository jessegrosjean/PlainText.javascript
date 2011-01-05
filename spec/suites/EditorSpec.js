xdescribe('Editor', function() {

	describe('new editor', function() {
		var newEditor;
		
		beforeEach(function() {
			newEditor = editor({});
		});

		it('should have a root section', function() {
			expect(newEditor.rootSection()).toBeDefined();
			expect(newEditor.rootSection()).not.toBeNull();
		});

	});

	describe('text content', function() {
		var newEditor;
		
		beforeEach(function() {
			newEditor = editor({});
		});

		it('should start empty', function() {
			expect(newEditor.sectionTextContent()).toEqual('');
		});

		it('should create one section for empty line', function() {
			newEditor.setSectionTextContent('');
			expect(newEditor.rootSection().sectionChildren().length).toEqual(1);
		});
		
		it('should create one section for text with no newline', function() {
			newEditor.setSectionTextContent('one');
			expect(newEditor.rootSection().sectionChildren().length).toEqual(1);
		});

		it('should create two sections for text with one newline', function() {
			newEditor.setSectionTextContent('one\n');
			expect(newEditor.rootSection().sectionChildren().length).toEqual(2);
			newEditor.setSectionTextContent('one\ntwo');
			expect(newEditor.rootSection().sectionChildren().length).toEqual(2);
		});

		it('should get the same text content that was set', function() {
			newEditor.setSectionTextContent('one\ntwo');
			expect(newEditor.sectionTextContent()).toEqual('one\ntwo');
		});
		
	});

});