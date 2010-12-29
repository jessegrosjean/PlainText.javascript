describe("Range", function() {
	var range;
	
	beforeEach(function() {
		range = document.createRange();
	});

	afterEach(function() {
		range.detach();
	});
	
	it("should be created", function() {
		expect(range).not.toBeNull();
	});

});