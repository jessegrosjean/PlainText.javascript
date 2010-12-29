describe("Section", function() {

	describe("new section", function() {
		var newSection;
		
		beforeEach(function() {
			newSection = document.createSectionElement('');
		});

		it("should be created", function() {
			expect(newSection).not.toBeNull();
		});
		
		it("should have empty text content", function() {
			expect(newSection.sectionTextContent()).toEqual("");
		});

		it("should have no tags", function() {
			expect(newSection.firstSectionTag()).toBeNull();
		});

		it("parent, siblings and children should be null", function() {
			expect(newSection.parentSection()).toBeNull();
			expect(newSection.nextSectionSibling()).toBeNull();
			expect(newSection.previousSectionSibling()).toBeNull();
			expect(newSection.firstSectionChild()).toBeNull();
			expect(newSection.lastSectionChild()).toBeNull();
		});

		it("should consist of a list item containing a div", function() {
			expect(newSection.outerHTML).toEqual('<li><div></div></li>');
		});
		
		it("tree order next and previous should be null", function() {
			expect(newSection.treeOrderSectionNext()).toBeNull();
			expect(newSection.treeOrderSectionPrevious()).toBeNull();
		});

		it("tree leftmost and rightmost descendant should equal the new section", function() {
			expect(newSection.leftmostSectionDescendantOrSelf()).toEqual(newSection);
			expect(newSection.rightmostSectionDescendantOrSelf()).toEqual(newSection);
		});
		
	});
	
	describe("section structure", function() {
		var parent;
		var child1;
		var child2;
		var child1Child1;
		
		beforeEach(function() {
			parent = document.createSectionElement('parent');
			child1 = document.createSectionElement('child1');
			child2 = document.createSectionElement('child2');
			child1Child1 = document.createSectionElement('child1Child1');
			parent.appendSectionChild(child1);
			parent.appendSectionChild(child2);
			child1.appendSectionChild(child1Child1);
		});

		it("should create nested list structure", function() {
			expect(parent.outerHTML).toEqual('<li><div>parent</div><ul><li><div>child1</div><ul><li><div>child1Child1</div></li></ul></li><li><div>child2</div></li></ul></li>');
		});
		
		it("leftmost descendent should equal child2", function() {
			expect(parent.leftmostSectionDescendantOrSelf()).toEqual(child2);
		});

		it("rightmost descendent should equal child1child1", function() {
			expect(parent.rightmostSectionDescendantOrSelf()).toEqual(child1Child1);
		});

		it("descendents should inclucde all but parent", function() {
			expect(parent.sectionDescendants().length).toEqual(3);
		});
				
		it("descendents with self should inclucde all including parent", function() {
			expect(parent.sectionDescendantsWithSelf().length).toEqual(4);
		});
	});

	describe("section tags", function() {
	});

});