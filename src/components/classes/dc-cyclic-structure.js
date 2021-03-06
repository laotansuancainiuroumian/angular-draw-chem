(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCCyclicStructure", DCCyclicStructure);

	function DCCyclicStructure() {

		var service = {};

    /**
		* Creates a new `CyclicStructure` object.
		* @class
    * @param {string} name - name of the cyclic structure,
    * @param {number} ringSize - size of the ring,
    * @param {number} angle - angle in degrees between two bonds (vectors) in the ring,
		* @param {number} mult - associated multiplicity of the bond (1 for saturated, 2 for aromatic),
    * @param {boolean} aromatic - true if structure is aromatic
		*/
    function CyclicStructure(name, ringSize, angle, mult, aromatic) {
      this.name = name;
      this.ringSize = ringSize;
      this.angle = angle;
			this.mult = mult;
      this.aromatic = aromatic;
    }

    /**
    * Gets name of cyclic structure.
    * @returns {string}
    */
    CyclicStructure.prototype.getName = function () {
      return this.name;
    };

    /**
    * Gets ring size of cyclic structure.
    * @returns {number}
    */
    CyclicStructure.prototype.getRingSize = function () {
      return this.ringSize;
    };

		/**
    * Gets multiplicity of cyclic structure.
    * @returns {number}
    */
    CyclicStructure.prototype.getMult = function () {
      return this.mult;
    };

    /**
    * Gets angle in degrees between two bonds (vectors) in the ring.
    * @returns {string}
    */
    CyclicStructure.prototype.getAngle = function () {
      return this.angle;
    };

    /**
    * Checks if structure is aromatic.
    * @returns {boolean}
    */
    CyclicStructure.prototype.isAromatic = function () {
      return !!this.aromatic;
    };

    service.CyclicStructure = CyclicStructure;

		return service;
	}
})();
