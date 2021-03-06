(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructureCluster", DCStructureCluster);

	DCStructureCluster.$inject = ["DrawChemUtils", "DrawChemConst"];

	function DCStructureCluster(Utils, Const) {

		var service = {};

		/**
		* Creates a new `StructureCluster` object.
		* @class
		* @param {string} name - name of the cluster,
		* @param {Structure[]} defs - array of Structure objects belonging to the cluster,
		* @param {number} ringSize - size of the associated ring, defaults to 0 for acyclic structures,
		* @param {number} angle - angle between bonds in cyclic structures,
		* @param {number} mult - multiplicity of the associated bond (undefined for cyclic structures),
		* @param {boolean} aromatic - true if is aromatic
		*/
		function StructureCluster(name, defs, ringSize, angle, mult, aromatic) {
			this.name = name;
			this.defs = defs;
			this.ringSize = ringSize;
			this.angle = angle;
			this.aromatic = aromatic;
			this.multiplicity = mult;
			this.defaultStructure = defs[0];
		}

		/**
		* Gets `defs` array.
		* @returns {Structure[]}
		*/
		StructureCluster.prototype.getDefs = function () {
			return this.defs;
		};

		/**
		* Gets name of the cluster.
		* @returns {string}
		*/
		StructureCluster.prototype.getName = function () {
			return this.name;
		};

		/**
		* Gets size of the associated ring. Defaults to 0 for acyclic structures.
		* @returns {number}
		*/
		StructureCluster.prototype.getRingSize = function () {
			return this.ringSize;
		};

		/**
		* Gets multiplicity of the associated bond. Undefined for cyclic structures.
		* @returns {number}
		*/
		StructureCluster.prototype.getMult = function () {
			return this.multiplicity;
		};

		/**
		* Checks if structures associated with this object are aromatic.
		* @returns {boolean}
		*/
		StructureCluster.prototype.isAromatic = function () {
			return !!this.aromatic;
		};

		/**
		* Gets angle between bonds (vectors) in the associated ring.
		* @returns {number}
		*/
		StructureCluster.prototype.getAngle = function () {
			return this.angle;
		};

		/**
		* Gets default `Structure` object.
		* @returns {Structure}
		*/
		StructureCluster.prototype.getDefault = function () {
			return this.defaultStructure;
		};

		/**
		* Gets a suitable `Structure` based on supplied coordinates.
		* @param {number[]} mouseCoords1 - coordinates associated with onMouseDown event,
		* @param {number[]} mouseCoords2 - coordinates associated with onMouseUp event,
		* @returns {Structure}
		*/
		StructureCluster.prototype.getStructure = function (mouseCoords1, mouseCoords2) {
			var i, possibleVectors = [], vector, bond;

			if (Utils.insideCircle(mouseCoords1, mouseCoords2, Const.CIRC_R)) {
				return this.defaultStructure;
			}
			
			for (i = 0; i < Const.BONDS.length; i += 1) {
				possibleVectors.push(Const.BONDS[i].bond);
			}
			vector = Utils.getClosestVector(mouseCoords1, mouseCoords2, possibleVectors);
			for (i = 0; i < this.defs.length; i += 1) {
				bond = Const.getBondByDirection(this.defs[i].getName()).bond;
				if (Utils.compareVectors(bond, vector, 5)) {
					return this.defs[i];
				}
			}
		};

		service.StructureCluster = StructureCluster;

		return service;
	}
})();
