(function() {
    'use strict';

    AFRAME.registerComponent('collider', {
        init: function() {
            this.el.sceneEl.addBehavior(this); // Register our functionality against the Three.js object
            this.others = document.querySelectorAll('a-obj-model[collidable], a-entity[collidable]'); // Find all the elements we might want to collide with
        },

        tick: function() {
            var scene = this.el.sceneEl.object3D;
            scene.updateMatrixWorld(); // Need to refresh our 3D positions every render

            var thisPosition = getGlobalPosition(this.el.object3D);

            this.others.forEach(function(other) {
                var otherPosition = getGlobalPosition(other.object3D);
                var distance = distanceVector(thisPosition, otherPosition);
                var triggerDistance = parseInt(other.getAttribute('collidable'));

                if (!other.is('collided') && distance < triggerDistance) { // Check if a collision has taken place
                    // Trigger our "collided" event for A-Frame to then pick up
                    other.addState('collided');
                    other.emit('collided');
                    other.setAttribute('collided', 'true');
                }
            });
        }
    });

    function distanceVector(v1, v2) {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        var dz = v1.z - v2.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    function getGlobalPosition(obj) {
        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition(obj.matrixWorld);

        return vector;
    }
}());
