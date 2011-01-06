describe('Tag', function() {

	beforeEach(function() {
	});

	describe('new', function() {
		var newTag;
		
		beforeEach(function() {
			newTag = new Tag();
		});
		
		it('should have an empty name', function() {
			expect(newTag.name()).toEqual('');
		});

		it('should have an empty value', function() {
			expect(newTag.value()).toEqual('');
		});

		it('should have a string value of @', function() {
			expect(newTag.toString()).toEqual('@');
		});
		
		it('should have a null section, nextTag, and previousTag', function() {
			expect(newTag.section()).toBeNull();
			expect(newTag.nextTag()).toBeNull();
			expect(newTag.previousTag()).toBeNull();
		});
		
	});

	describe('name', function() {
		var tag;
		
		beforeEach(function() {
			tag = new Tag();
		});
		
		it('should return the exact text that is set', function() {
			tag.setName('name');
			expect(tag.name()).toEqual('name');
		});

		it('should throw exception if doesnt match /\w*/', function() {
			try {
				tag.setName('na me');
				expect(true).toEqual(false);
			} catch (e) {
				expect(e.message).toEqual("Invalid tag name");
			}
		});
		
	});

	describe('value', function() {
		var tag;
		
		beforeEach(function() {
			tag = new Tag();
		});
		
		it('should return the exact text that is set', function() {
			tag.setValue('my value with spaces');
			expect(tag.value()).toEqual('my value with spaces');
		});

		it('should throw exception if doesnt match /(?:[^\\)]*)/', function() {
			try {
				tag.setValue(')');
				expect(true).toEqual(false);
			} catch (e) {
				expect(e.message).toEqual("Invalid tag value");
			}
		});
		
	});

	describe('parsing', function() {
		var tag;
		
		beforeEach(function() {
			tag = new Tag();
		});
		
		it('should should find one tag with name = "tag" and empty value in "@tag"', function() {
			var tags = Tag.parseTags('@tag');
			expect(tags[0].name()).toEqual('tag');
			expect(tags[0].value()).toEqual('');
		});

		it('should should find one tag with name = "tag" and value = "my value" in "@tag(my value)"', function() {
			var tags = Tag.parseTags('@tag(my value)');
			expect(tags[0].name()).toEqual('tag');
			expect(tags[0].value()).toEqual('my value');
		});
	
		it('should should find two tags in "some text wiht @atag @tag(my value)"', function() {
			var tags = Tag.parseTags('some text ending with tags @atag @tag(my value)');
			expect(tags[0].name()).toEqual('atag');
			expect(tags[0].value()).toEqual('');
			expect(tags[1].name()).toEqual('tag');
			expect(tags[1].value()).toEqual('my value');
		});

	});

});