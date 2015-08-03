angular.module('bdQuery', [])
    .factory('Query', [
        '$timeout',
        'Restangular',
        'promiseTracker',
        QueryService
    ]);

function QueryService ($timeout, Restangular, promiseTracker) {

    var Query = function (opts) {
        this.page = 1;
        this.isQuerying = false;
        this.tracker = null;
        this.noMoreData = false;
    };

    Query.prototype.checkOptions = function (opts) {
        if (!opts) {
            throw new Error('opts is required.');
        }

        if (!opts.scope) {
            throw new Error('opts.scope is require.');
        }

        if (!opts.route) {
            throw new Error('opts.route is require.');
        }
    };

    Query.prototype.query = function (opts) {
        var self = this;
        self.checkOptions(opts);
        self.tracker = promiseTracker();

        self.isQuerying = true;
        var params = angular.extend({page: self.page}, opts.params);
        var q = Restangular.one(opts.route).get(params).then(function (res) {
            res = res.plain();

            if (angular.isDefined(opts.scope.objects)) {
                opts.scope.objects = opts.scope.objects.concat(res.objects);
            } else {
                opts.scope.objects = res.objects;
            }

            if (res.objects.length === 0) {
                self.noMoreData = true;
            }

            $timeout(function () {
                self.page++;
                self.isQuerying = false;
            }, 1000);

        });

        self.tracker.addPromise(q);

        return q;

    };

    return Query;

}
