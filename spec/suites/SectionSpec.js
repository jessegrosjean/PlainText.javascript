describe('Section', function() {

	describe('new section', function() {
		var newSection;
		
		beforeEach(function() {
			newSection = new Section();
		});

		it('should be created', function() {
			expect(newSection).not.toBeNull();
		});
		
		it('should have empty non null text content', function() {
			expect(newSection.textContent()).toEqual('');
		});

		it('should have no tags', function() {
			expect(newSection.hasTags()).toEqual(false);
		});

		it('should have no children', function() {
			expect(newSection.hasChildren()).toEqual(false);
		});

		it('parent, siblings and children should be null', function() {
			expect(newSection.parent()).toBeNull();
			expect(newSection.nextSibling()).toBeNull();
			expect(newSection.previousSibling()).toBeNull();
			expect(newSection.firstChild()).toBeNull();
			expect(newSection.lastChild()).toBeNull();
		});

		it('should have DOM representation of a list item containing a div', function() {
			expect(newSection.sectionLI().outerHTML).toEqual('<li><div></div></li>');
		});
		
		it('tree order next and previous should be null', function() {
			expect(newSection.treeOrderNext()).toBeNull();
			expect(newSection.treeOrderPrevious()).toBeNull();
		});

		it('tree leftmost and rightmost descendant should equal the new section', function() {
			expect(newSection.leftmostDescendantOrSelf()).toEqual(newSection);
			expect(newSection.rightmostDescendantOrSelf()).toEqual(newSection);
		});
		
	});
	
	describe('section structure (parent > ((child1 > child1Child1), child2, child3))', function() {
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

		it('should create nested list structure in DOM', function() {
			expect(parent.sectionLI().outerHTML).toEqual('<li><div>parent</div><ul><li><div>child1</div><ul><li><div>child1Child1</div></li></ul></li><li><div>child2</div></li><li><div>child3</div></li></ul></li>');
		});
		
		it('parent leftmost descendent should equal child3', function() {
			expect(parent.leftmostDescendantOrSelf()).toEqual(child3);
		});

		it('parent rightmost descendent should equal child1child1', function() {
			expect(parent.rightmostDescendantOrSelf()).toEqual(child1Child1);
		});

		it('parent tree order next should equal child1', function() {
			expect(parent.treeOrderNext()).toEqual(child1);
		});

		it('child1Child1 tree order next should equal child2', function() {
			expect(child1Child1.treeOrderNext()).toEqual(child2);
		});

		it('parent should include all but self in descendents', function() {
			expect(parent.descendants().length).toEqual(4);
		});
				
		it('parent should include self in descendants with self.', function() {
			expect(parent.descendantsWithSelf().length).toEqual(5);
		});
		
		it('should disconnect child2 when removed and connect new siblings child1 and child3', function() {
			parent.removeChild(child2);
			expect(child2.parent()).toBeNull();
			expect(child2.nextSibling()).toBeNull();
			expect(child2.previousSibling()).toBeNull();
			expect(child1.nextSibling()).toEqual(child3);
			expect(child3.previousSibling()).toEqual(child1);
		});
		
		it('parent should upldate first child to child2 if child1 is removed', function() {
			parent.removeChild(child1);
			expect(parent.firstChild()).toEqual(child2);
		});

		it('parent should upldate last child if child3 is removed', function() {
			parent.removeChild(child3);
			expect(parent.lastChild()).toEqual(child2);
		});
		
	});

});