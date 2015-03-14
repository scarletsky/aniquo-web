angular.module('bdTracker', [])
  .directive('bdTracker', [
    TrackerDirective
  ]);

function TrackerDirective () {
  return {
    scope: false,
    templateUrl: 'views/partials/tracker.html'
  }
}
