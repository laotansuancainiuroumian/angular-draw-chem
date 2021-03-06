describe("DrawChemEditor directive tests - part2", function () {
	beforeEach(module("mmAngularDrawChem"));

	var $scope, element, $rootScope, DrawChem, DrawChemModStructure, DrawChemStructures, template, styleFull;

	beforeEach(inject(function ($httpBackend, $compile, _$rootScope_, _DrawChem_, _DrawChemModStructure_, _DrawChemStructures_) {
		// configure path for static files
		jasmine.getFixtures().fixturesPath = "base/assets/";
		// load template of the editor
		template = readFixtures("draw-chem-editor-modal.html");

		DrawChem = _DrawChem_;
		DrawChemModStructure = _DrawChemModStructure_;
		DrawChemStructures = _DrawChemStructures_;
		$rootScope = _$rootScope_;

		$scope = $rootScope.$new();
		element = angular.element(
			"<div draw-chem-editor dc-modal></div>"
		);
		temp = $compile(element)($scope);
		$httpBackend
			.expectGET("draw-chem-editor-modal.html")
			.respond(template);
		$scope.$digest();
		$httpBackend.flush();
	}));

	it("should undo the most recent changes", function () {
		var custom = DrawChemStructures.benzene(),
			add = DrawChemStructures.singleBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		mouseClick(temp, 100, 100);
		temp.find("#dc-single-bond").click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(add.getDefault());
		mouseClick(temp, 101, 99);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 98.00 98.00 L 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
							"<circle class=\"arom\" cx=\"98.00\" cy=\"118.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
		mouseClick(temp, 118, 110);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 115.32 108.00 L 132.64 98.00 \"></path>" +
							"<path d=\"M 98.00 98.00 L 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"113.82\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 113.82, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +							
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"132.64\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
							"<circle class=\"arom\" cx=\"98.00\" cy=\"118.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
		temp.find("#dc-undo").click();
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
					"<g id=\"cmpd1\">" +
						"<style type=\"text/css\">" +
							styleBase + styleExpanded +
						"</style>" +
						"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
						"<path d=\"M 98.00 98.00 L 98.00 78.00 \"></path>" +
						"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
						"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
						"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
						"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
						"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
						"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
						"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
						"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
						"<circle class=\"arom\" cx=\"98.00\" cy=\"118.00\" r=\"9.00\"></circle>" +
					"</g>" +
				"</svg>"
			);
	});

	it("should label the atom", function () {
		var custom = DrawChemStructures.benzene(),
			add = DrawChemStructures.singleBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		mouseClick(temp, 100, 100);
		temp.find("#dc-single-bond").click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(add.getDefault());
		mouseClick(temp, 100, 100);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 98.00 98.00 L 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
							"<circle class=\"arom\" cx=\"98.00\" cy=\"118.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
		mouseClick(temp, 115, 108);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 115.32 108.00 L 132.64 98.00 \"></path>" +
							"<path d=\"M 98.00 98.00 L 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"113.82\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 113.82, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"132.64\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
							"<circle class=\"arom\" cx=\"98.00\" cy=\"118.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
		temp.find("#dc-oxygen").click();
		mouseClick(temp, 133, 98);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
					"<g id=\"cmpd1\">" +
						"<style type=\"text/css\">" +
							styleBase + styleExpanded +
						"</style>" +
						"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
						"<path d=\"M 115.32 108.00 L 127.44 101.00 \"></path>" +
						"<path d=\"M 98.00 98.00 L 98.00 78.00 \"></path>" +
						"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
						"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
						"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
						"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
						"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
						"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
						"<rect class=\"focus\" x=\"113.82\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 113.82, 105.40)\"></rect>" +
						"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
						"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
						"<circle class=\"label\" cx=\"132.64\" cy=\"98.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
						"<text class=\"edit\" dy=\"0.2125em\" x=\"128.64\" y=\"99.80\" atomx=\"132.64\" atomy=\"98.00\" text-anchor=\"start\">" +
						  "<tspan>O</tspan><tspan>H</tspan>" +
						"</text>" +
						"<circle class=\"arom\" cx=\"98.00\" cy=\"118.00\" r=\"9.00\"></circle>" +
					"</g>" +
				"</svg>"
			);
	});

	it("should remove label from atom (clicking on an atom without label on it should do nothing)", function () {
		var custom = DrawChemStructures.benzene(),
			add = DrawChemStructures.singleBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		mouseClick(temp, 100, 100);
		temp.find("#dc-single-bond").click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(add.getDefault());
		mouseClick(temp, 101, 99);
		mouseClick(temp, 118, 110);
		temp.find("#dc-oxygen").click();
		mouseClick(temp, 133, 98);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
					"<g id=\"cmpd1\">" +
						"<style type=\"text/css\">" +
							styleBase + styleExpanded +
						"</style>" +
						"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
						"<path d=\"M 115.32 108.00 L 127.44 101.00 \"></path>" +
						"<path d=\"M 98.00 98.00 L 98.00 78.00 \"></path>" +
						"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
						"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
						"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
						"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
						"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
						"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
						"<rect class=\"focus\" x=\"113.82\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 113.82, 105.40)\"></rect>" +
						"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
						"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
						"<circle class=\"label\" cx=\"132.64\" cy=\"98.00\" r=\"3.40\"></circle>" +
						"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
						"<text class=\"edit\" dy=\"0.2125em\" x=\"128.64\" y=\"99.80\" atomx=\"132.64\" atomy=\"98.00\" text-anchor=\"start\">" +
						  "<tspan>O</tspan><tspan>H</tspan>" +
						"</text>" +
						"<circle class=\"arom\" cx=\"98.00\" cy=\"118.00\" r=\"9.00\"></circle>" +
					"</g>" +
				"</svg>"
			);
		temp.find("#dc-remove-label").click();
		mouseClick(temp, 133, 98);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 115.32 108.00 L 132.64 98.00 \"></path>" +
							"<path d=\"M 98.00 98.00 L 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"113.82\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 113.82, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"132.64\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
							"<circle class=\"arom\" cx=\"98.00\" cy=\"118.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
		mouseClick(temp, 133, 98);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
							"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 115.32 108.00 L 132.64 98.00 \"></path>" +
							"<path d=\"M 98.00 98.00 L 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"113.82\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 113.82, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"132.64\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
							"<circle class=\"arom\" cx=\"98.00\" cy=\"118.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});
});
