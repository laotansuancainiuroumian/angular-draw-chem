(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemShapes", DrawChemShapes);
		
	DrawChemShapes.$inject = ["DCShape", "DrawChemConst", "DCAtom", "DCBond"];
	
	function DrawChemShapes(DCShape, DrawChemConst, DCAtom, DCBond) {
		
		var service = {},
			BOND_LENGTH = DrawChemConst.BOND_LENGTH,
			BONDS_AUX = DrawChemConst.BONDS_AUX,
			BETWEEN_DBL_BONDS = DrawChemConst.BETWEEN_DBL_BONDS,
			BETWEEN_TRP_BONDS = DrawChemConst.BETWEEN_TRP_BONDS,
			Atom = DCAtom.Atom;
		
		/**
		 * Modifies the structure.
		 * @param {Structure} base - structure to be modified,
		 * @param {StructureCluster} mod - StructureCluster containing appropriate Structure objects,
		 * @param {Number[]} mousePos - position of the mouse when 'mouseup' event occurred
		 * @param {Number[]|undefined} down - position of the mouse when 'mousedown' event occurred
		 * @param {Boolean} mouseDownAndMove - true if 'mouseonmove' and 'mousedown' are true
		 * @returns {Structure}
		 */
		service.modifyStructure = function (base, mod, mousePos, down, mouseDownAndMove) {
			var modStr,
				found = false,
				isInsideCircle,
				origin = base.getOrigin();	
			
			modStructure(base.getStructure(), origin);
			
			return base;
			
			/**
			* Recursively looks for an atom to modify.
			* @param {Atom[]|Bond[]} struct - array of atoms or array of bonds,
			* @param {Number[]} pos - absolute coordinates of an atom
			*/
			function modStructure(struct, pos) {
				var i, absPos, aux;
				for(i = 0; i < struct.length; i += 1) {
					aux = struct[i] instanceof Atom ? struct[i]: struct[i].getAtom();
					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];
					
					if (found) { break; }
					
					isInsideCircle = insideCircle(absPos, mousePos);
					
					if (isInsideCircle && !mouseDownAndMove) {
						// if 'mouseup' was within a circle around an atom
						// and if a valid atom has not already been found
							modStr = chooseMod(aux);			
							updateBonds(aux, modStr, absPos);
							updateDecorate(modStr, absPos);
							found = true;
							return base;										
					}
					
					if (!isInsideCircle && compareCoords(down, absPos, 5)) {
						// if 'mousedown' was within a circle around an atom
						// but 'mouseup' was not
						// and if a valid atom has not already been found
						modStr = chooseDirectionManually(aux);
						updateBonds(aux, modStr, absPos);
						updateDecorate(modStr, absPos);
						found = true;
						return base;
					}
					
					// if none of the above was true, then continue looking down the structure tree
					modStructure(aux.getBonds(), absPos);
				}
				
				/**
				 * Updates decorate elements (e.g. aromatic rings) in the structure.
				 * @param {Structure} modStr - Structure object which may contain decorate elements
				 * @param {Number[]} abs - absolute coordinates
				 */
				function updateDecorate(modStr, abs) {
					var coords;
					if (modStr !== null && typeof modStr.getDecorate("aromatic") !== "undefined") {
						coords = DrawChemConst.getBondByDirection(modStr.getName()).bond;
						return base.addDecorate("aromatic", [coords[0] + abs[0], coords[1] + abs[1]]);
					}					
				}
				
				/**
				 * Updates bonds array in an Atom object.
				 * @param {Atom} atom - an Atom object or Bond object to update
				 * @param {Atom[]} modStr - an array of Atom objects to attach
				 * @param {Number[]} absPos - absolute position of the atom to update
				 */
				function updateBonds(atom, modStr, absPos) {
					if (modStr !== null) {		
						modifyExisting(modStr, absPos);
						atom.addBonds(modStr.getStructure(0).getBonds());
					}
				}
				
				/**
				 * Checks if an atom already exists. If it does, that atoms attachedBonds array is updated.
				 * @param {Atom[]} modStr - an array of Atom objects
				 * @param {Number[]} absPos - absolute position of the atom to update
				 */
				function modifyExisting(modStr, absPos) {					
					var i, newAbsPos, atom, newName,
						struct = modStr.getStructure(0).getBonds();
					for(i = 0; i < struct.length; i += 1) {
						newAbsPos = [struct[i].getAtom().getCoords("x") + absPos[0], struct[i].getAtom().getCoords("y") + absPos[1]];
						atom = service.isWithin(base, newAbsPos).foundAtom;
						if (typeof atom !== "undefined") {
							newName = Atom.getOppositeDirection(modStr.getName());
							atom.attachBond(newName);
							return atom.calculateNext();
						}
					}
				}
			}
			
			/**
			 * Compares coordinates in two arrays. Returns false if at least one of them is undefined or if any pair of the coordinates is inequal.
			 * Returns true if they are equal.
			 * @param {Number[]} arr1 - an array of coordinates,
			 * @param {Number[]} arr2 - an array of coordinates,
			 * @param {Number} prec - precision,
			 * @returns {Boolean}
			 */
			function compareCoords(arr1, arr2, prec) {				
				if (typeof arr1 === "undefined" || typeof arr2 === "undefined") {
					return false;
				}
				return arr1[0].toFixed(prec) === arr2[0].toFixed(prec) && arr1[1].toFixed(prec) === arr2[1].toFixed(prec);
			}
			
			/**
			 * Lets the user decide in which of the eight directions the next bond is going to be pointing.
			 * Draws a circle around a chosen atom and divides it into eight equal parts. Checks to which part the coordinates
			 * associated with the 'mouseup' event belong and chooses the suitable bond.
			 * @param {Atom} current - currently active Atom object
			 * @returns {Atom[]}
			 */
			function chooseDirectionManually(current) {
				return chooseMod(current, service.getDirection(mousePos, down));
			}			
			
			/**
			 * Chooses a suitable modification from mod object.
			 * @param {Atom} current - currently active Atom object
			 * @param {String|undefined} - outgoing direction (either manually or automatically set)
			 * @returns {Atom[]}
			 */
			function chooseMod(current, output) {
				var i, at, name, toCompare, next;
				if (mod.defs.length === 1) {
					return mod.getDefault().getStructure(0).getBonds();
				} else {
					for(i = 0; i < mod.defs.length; i += 1) {
						at = mod.defs[i];
						next = current.getNext();
						if (next === "max") {
							return null;
						}
						name = at.getName();
						toCompare = output || next;
						if (toCompare === name) {
							current.attachBond(name);
							current.calculateNext();							
							return at;
						}
					}
				}
			}
		}
		
		/**
		 * Checks if the mouse pointer is within a circle of an atom. If the atom is found, a function is called on it (if supplied).
		 * @param {Structure} structure - a Structure object on which search is performed
		 * @param {Number[]} position - set of coordinates against which the search is performed
		 * @returns {Atom}
		 */
		service.isWithin = function (structure, position) {
			var found = false,
				foundObj = {},
				origin = structure.getOrigin();
				
			check(structure.getStructure(), origin);
			
			return foundObj;
			
			function check(struct, pos) {
				var i, absPos, aux;
				for(i = 0; i < struct.length; i += 1) {
					aux = struct[i] instanceof Atom ? struct[i]: struct[i].getAtom();
					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];
					if (!found && insideCircle(absPos, position)) {
						found = true;
						foundObj.foundAtom = aux;
						foundObj.absPos = absPos;
					} else {
						check(aux.getBonds(), absPos);
					}
				}	
			}
		}
		
		/**
		 * Generates the desired output based on given input.
		 * @param {Structure} input - a Structure object containing all information needed to render the shape
		 * @param {String} id - id of the object to be created (will be used inside 'g' tag and in 'use' tag)
		 */
		service.draw = function (input, id) {
			var shape,
				output = parseInput(input),
				paths = output.paths,
				circles = output.circles,
				labels = output.labels,
				minMax = output.minMax;
			shape = new DCShape.Shape(genElements().full, genElements().mini, id);
			shape.elementFull = shape.generateStyle("full") + shape.elementFull;
			shape.elementMini = shape.generateStyle("mini") + shape.elementMini;
			shape.setMinMax(minMax);
			return shape;
			
			/**
			 * Generates a string from the output array and wraps each line with 'path' tags, each circle with 'circle' tags,
			 * and each decorate element with suitable tags.
			 */
			function genElements() {
				var full = "", mini = "", aux = "";
				paths.forEach(function (path) {
					if (typeof path.class !== "undefined") {
						aux = "<path class='" + path.class + "' d='" + path.line + "'></path>";
					} else {
						aux = "<path d='" + path.line + "'></path>";
					}					
					full += aux;
					mini += aux;					
				});
				circles.forEach(function (circle) {
					full += "<circle class='atom' cx='" + circle[0] + "' cy='" + circle[1] + "' r='" + circle[2] + "' ></circle>";
				});
				labels.forEach(function (label) {
					aux = drawDodecagon(label) + "<text x='" + label.x +  "' y='" + label.y + "'>" + label.label + "</text>";					
					full += aux;
					mini += aux;
				});
				if (input.getDecorate("aromatic")) {
					input.getDecorate("aromatic").forEach(function (coords) {
						aux = "<circle class='arom' cx='" + coords[0] +
						"' cy='" + coords[1] +
						"' r='" + DrawChemConst.AROMATIC_R +
						"' ></circle>";
						full += aux;
						mini += aux;
					})					
				}
				
				return {
					full: full,
					mini: mini
				};
				
				function drawDodecagon(label) {
					var i, x, y,
						factor = (label.height * 0.4) / BOND_LENGTH,
						result = [];
					for (i = 0; i < BONDS_AUX.length; i += 1) {
						x = BONDS_AUX[i].bond[0];
						y = BONDS_AUX[i].bond[1];
						result = result.concat(addCoords([label.x, label.y], [x, y], factor));
					}					
					return "<polygon class='text' points='" + stringifyPaths([result])[0].line + "'></polygon>";
				}
			}
			
			/**
			* Translates the input into an svg-suitable set of coordinates.
			* @param {Structure} input - an input object
			* @returns {Object}
			*/
		    function parseInput(input) {
				var output = [], circles = [], labels = [],
					origin = input.getOrigin(),
					minMax = {
						minX: origin[0],
						minY: origin[1],
						maxX: origin[0],
						maxY: origin[1]
					},
					circR = DrawChemConst.CIRC_R,
					// sets the coordinates of the root element
					// 'M' for 'moveto' - sets pen to the coordinates
					len = output.push(["M", origin]);
				   
				circles.push([
				   input.getOrigin("x"),
				   input.getOrigin("y"),
				   circR
				]);
				
				updateLabel(origin, input.getStructure(0));
				connect(input.getStructure(0).getBonds(), output[len - 1]);
			   
				return {
					paths: stringifyPaths(output),
					circles: circles,
					labels: labels,
					minMax: minMax
				};
			   
				/**
				* Recursively translates the input, until it finds an element with an empty 'bonds' array.
				* @param {Bond[]} bonds - an array of Bond objects
				* @param {String|Number[]} - an array of coordinates with 'M' and 'L' commands
				*/
				function connect(bonds, currentLine) {
					var i, absPos, atom, bondType,
						prevAbsPos = [
							circles[circles.length - 1][0],
							circles[circles.length - 1][1]
						];			
					for (i = 0; i < bonds.length; i += 1) {
						atom = bonds[i].getAtom();
						bondType = bonds[i].getType();
						absPos = [
							prevAbsPos[0] + atom.getCoords("x"),
							prevAbsPos[1] + atom.getCoords("y")
						];
						updateMinMax(absPos);
						updateLabel(absPos, atom);
						circles.push([absPos[0], absPos[1], circR]);
						if (i === 0) {
							drawLine(prevAbsPos, absPos, bondType, atom, "continue");
						} else {
							drawLine(prevAbsPos, absPos, bondType, atom, "begin");
						}
					}					
				}
				
				function drawLine(prevAbsPos, absPos, bondType, atom, mode) {
					var newLen = output.length;
					if (bondType === "single") {
						if (mode === "continue") {
							output[newLen - 1].push("L");
							output[newLen - 1].push(absPos);
						} else if (mode === "begin") {
							newLen = output.push(["M", prevAbsPos, "L", absPos]);
						}
					} else if (bondType === "double") {						
						output.push(calcDoubleBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "triple") {
						output.push(calcTripleBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "wedge") {
						output.push(calcWedgeBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "dash") {
						output.push(calcDashBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					}
					connect(atom.getBonds(), output[newLen - 1]);					
				}
				
				function calcDoubleBondCoords(start, end) {
					var vectCoords = [end[0] - start[0], end[1] - start[1]],
						perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
						perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
						M1 = addCoords(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
						L1 = addCoords(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
						M2 = addCoords(start, perpVectCoordsCW, BETWEEN_DBL_BONDS),
						L2 = addCoords(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
					return ["M", M1, "L", L1, "M", M2, "L", L2];
				}
				
				function calcTripleBondCoords(start, end) {
					var vectCoords = [end[0] - start[0], end[1] - start[1]],
						perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
						perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
						M1 = addCoords(start, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
						L1 = addCoords(end, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
						M2 = addCoords(start, perpVectCoordsCW, BETWEEN_TRP_BONDS),
						L2 = addCoords(end, perpVectCoordsCW, BETWEEN_TRP_BONDS);
					return ["M", M1, "L", L1, "M", start, "L", end, "M", M2, "L", L2];
				}
				
				function calcWedgeBondCoords(start, end) {
					var vectCoords = [end[0] - start[0], end[1] - start[1]],
						perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
						perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
						L1 = addCoords(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
						L2 = addCoords(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
					return ["wedge", "M", start, "L", L1, "L", L2, "Z"];
				}
				
				function calcDashBondCoords(start, end) {
					var i, max = 7, factor = BETWEEN_DBL_BONDS / max, M, L, currentEnd = start, result = [],
						vectCoords = [end[0] - start[0], end[1] - start[1]],
						perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
						perpVectCoordsCW = [vectCoords[1], -vectCoords[0]];
						
					for (i = max; i > 0; i -= 1) {
						factor = factor + BETWEEN_DBL_BONDS / max;
						currentEnd = [currentEnd[0] + vectCoords[0] / max, currentEnd[1] + vectCoords[1] / max];
						M = addCoords(currentEnd, perpVectCoordsCCW, factor);
						L = addCoords(currentEnd, perpVectCoordsCW, factor);
						result = result.concat(["M", M, "L", L]);
					}
					return result;
				}
				
				function updateLabel(absPos, atom) {
					var label = atom.getLabel(),
						labelObj,
						width = DCShape.fontSize * label.length * 0.8,
						height = DCShape.fontSize * 1.1;
					if (label !== "") {
						labelObj = {
							x: absPos[0],
							y: absPos[1],
							label: label,
							width: width,
							height: height
						};
						labels.push(labelObj);
						updateMinMax([labelObj.x - 0.7 * labelObj.width / 2, labelObj.y - 0.7 * labelObj.height * 3 / 5]);
						updateMinMax([labelObj.x + 0.7 * labelObj.width / 2, labelObj.y + 0.7 * labelObj.height * 2 / 5]);
					}					
				}
					
				function updateMinMax(absPos) {
					if (absPos[0] > minMax.maxX) {
						minMax.maxX = absPos[0];
					}
					if (absPos[0] < minMax.minX) {
						minMax.minX = absPos[0];
					}
					if (absPos[1] > minMax.maxY) {
						minMax.maxY = absPos[1];
					}
					if (absPos[1] < minMax.minY) {
						minMax.minY = absPos[1];
					}
				}
			}
		}
		
		/**
		 * Divides a circle (center at pos2) into 12 parts and checks to which part the coords at pos1 belong.
		 * @param {Number[]} pos1 - coordinates of the center
		 * @param {Number[]} pos2 - coords to check
		 * @returns {String}
		 */
		service.getDirection = function (pos1, pos2) {
			var alpha = Math.PI / 6,
				r = Math.sqrt(Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2)),
				x = Math.sin(alpha / 2) * r,
				x1 = Math.cos(3 * alpha / 2) * r,
				y = Math.cos(alpha / 2) * r,
				y1 = Math.sin(3 * alpha / 2) * r;
				
			if (check(-x, x, -r, -y)) {
				return "N";
			} else if (check(x, x1, -y, -y1)) {
				return "NE1";
			} else if (check(x1, y, -y1, -x)) {
				return "NE2";
			} else if (check(y, r, -x, x)) {
				return "E";
			} else if (check(x1, y, x, y1)) {
				return "SE1";
			} else if (check(x, x1, y1, y)) {
				return "SE2";
			} else if (check(-x, x, y, r)) {
				return "S";
			} else if (check(-x1, -x, y1, y)) {
				return "SW1";
			} else if (check(-y, -x1, x, y1)) {
				return "SW2";
			} else if (check(-r, -y, -x, x)) {
				return "W";
			} else if (check(-y, -x1, -y1, -x)) {
				return "NW1";
			} else if (check(-x1, -x, -y, -y1)) {
				return "NW2";
			}
			
			function check(arg1, arg2, arg3, arg4) {
				return pos1[0] >= (pos2[0] + arg1) && pos1[0] <= (pos2[0] + arg2) &&
					pos1[1] >= (pos2[1] + arg3) && pos1[1] <= (pos2[1] + arg4);
			}
		}
		
		return service;
		
		/**
		 * Checks if a point is inside an area delimited by a circle.
		 * @param {Number[]} center - coordinates of the center of a circle
		 * @param {Number[]} point - coordinates of a point to be validated
		 * @returns {Boolean}
		 */
		function insideCircle(center, point) {
			var tolerance = DrawChemConst.CIRC_R;
			return Math.abs(center[0] - point[0]) < tolerance && Math.abs(center[1] - point[1]) < tolerance;
		}
		
		/**
		* Transforms output into an array of strings.
		* Basically, it translates each array of coordinates into its string representation.
		* @returns {String[]}
		*/
		function stringifyPaths(output) {
			var result = [], i, j, line, point, lineStr;
			for (i = 0; i < output.length; i += 1) {
				line = output[i];
				lineStr = { line: "" };
				for (j = 0; j < line.length; j += 1) {
					point = line[j];
					if (typeof point === "string") {
						if (point === "wedge") {
							lineStr.class = "wedge";
						} else {
							lineStr.line += point + " ";
						}
					} else {
						lineStr.line += point[0] + " " + point[1] + " ";
					}
				}
				result.push(lineStr);
			}
			return result;
		}
		
		function addCoords(coords1, coords2, factor) {
			return typeof factor === "undefined" ?
				[(coords1[0] + coords2[0]).toFixed(2), (coords1[1] + coords2[1]).toFixed(2)]:
				[(coords1[0] + factor * coords2[0]).toFixed(2), (coords1[1] + factor * coords2[1]).toFixed(2)];
		}
	}
})();