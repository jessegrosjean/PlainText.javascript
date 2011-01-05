describe('Section', function() {

	describe('new', function() {
		var newSection;
		
		beforeEach(function() {
			newSection = new Section();
		});
		
		it('should have no tags', function() {
			expect(newSection.hasTags()).toEqual(false);
		});

		it('should have no children', function() {
			expect(newSection.hasChildren()).toEqual(false);
		});

		it('should have null parent, siblings and children', function() {
			expect(newSection.parent()).toBeNull();
			expect(newSection.nextSibling()).toBeNull();
			expect(newSection.previousSibling()).toBeNull();
			expect(newSection.firstChild()).toBeNull();
			expect(newSection.lastChild()).toBeNull();
		});
		
		it('should have null treeOrderNext and treeOrderPrevious', function() {
			expect(newSection.treeOrderNext()).toBeNull();
			expect(newSection.treeOrderPrevious()).toBeNull();
		});

		it('should return self for leftmostDescendantOrSelf and rightmostDescendantOrSelf', function() {
			expect(newSection.leftmostDescendantOrSelf()).toEqual(newSection);
			expect(newSection.rightmostDescendantOrSelf()).toEqual(newSection);
		});

		it('should have sectionLI DOM representation of <li><div></div></li>', function() {
			expect(newSection.sectionLI().outerHTML).toEqual('<li><div></div></li>');
		});
		
	});

	describe('text content', function() {
		var section;
		
		beforeEach(function() {
			section = new Section();
		});
		
		it('should be empty and non null in new sections', function() {
			expect(section.textContent()).toEqual('');
		});

		it('should match the exact value that is set', function() {
			section.setTextContent('my test');
			expect(section.textContent()).toEqual('my test');
		});

		it('should throw an exception if set to text containing a newline', function() {
			try {
				section.setTextContent('my test\nline two');
				expect(true).toEqual(false);
			} catch (e) {
				expect(e.message).toEqual("Text content must not have newlines");
			}
		});

		it('should match sectionContentDIV text content', function() {
			expect(section.textContent()).toEqual(section.sectionContentDIV().textContent);
			section.setTextContent('my test');
			expect(section.textContent()).toEqual(section.sectionContentDIV().textContent);
		});
		
	});
		
	describe('structure (parent > ((child1 > child1Child1), child2, child3))', function() {
		var parent;
		var child1;
		var child2;
		var child1Child1;
		
		beforeEach(function() {
			parent = new Section('parent');
			child1 = new Section('child1');
			child2 = new Section('child2');
			child3 = new Section('child3');
			child1Child1 = new Section('child1Child1');
			parent.appendChild(child1);
			parent.appendChild(child2);
			parent.appendChild(child3);
			child1.appendChild(child1Child1);
		});
		
		it('should return child3 for parent.leftmostDescendantOrSelf', function() {
			expect(parent.leftmostDescendantOrSelf()).toEqual(child3);
		});

		it('should return child1Child1 for parent.rightmostDescendantOrSelf', function() {
			expect(parent.rightmostDescendantOrSelf()).toEqual(child1Child1);
		});

		it('should return child1 for parent.treeOrderNext', function() {
			expect(parent.treeOrderNext()).toEqual(child1);
		});

		it('should return child2 for child1Child1.treeOrderNext', function() {
			expect(child1Child1.treeOrderNext()).toEqual(child2);
		});

		it('should return four descendants for parent', function() {
			expect(parent.descendants().length).toEqual(4);
		});
			
		it('should disconnect child2 when removed and connect new siblings child1 and child3', function() {
			parent.removeChild(child2);
			expect(child2.parent()).toBeNull();
			expect(child2.nextSibling()).toBeNull();
			expect(child2.previousSibling()).toBeNull();
			expect(child1.nextSibling()).toEqual(child3);
			expect(child3.previousSibling()).toEqual(child1);
		});
		
		it('should update parent first child to child2 if child1 is removed', function() {
			parent.removeChild(child1);
			expect(parent.firstChild()).toEqual(child2);
		});

		it('should update parent last child to child2 if child3 is removed', function() {
			parent.removeChild(child3);
			expect(parent.lastChild()).toEqual(child2);
		});
		
		it('should create nested LI > UL structure in DOM', function() {
			expect(parent.sectionLI().outerHTML).toEqual('<li><div>parent</div><ul><li><div>child1</div><ul><li><div>child1Child1</div></li></ul></li><li><div>child2</div></li><li><div>child3</div></li></ul></li>');
		});
		
	});

});