'use strict';

describe('ngMock', function() {
  var noop = angular.noop;


  describe('TzDate', function() {

    function minutes(min) {
      return min*60*1000;
    }

    it('should look like a Date', function() {
      var date = new angular.mock.TzDate(0,0);
      expect(angular.isDate(date)).toBe(true);
    });

    it('should take millis as constructor argument', function() {
      expect(new angular.mock.TzDate(0, 0).getTime()).toBe(0);
      expect(new angular.mock.TzDate(0, 1283555108000).getTime()).toBe(1283555108000);
    });

    it('should take dateString as constructor argument', function() {
      expect(new angular.mock.TzDate(0, '1970-01-01T00:00:00.000Z').getTime()).toBe(0);
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.023Z').getTime()).toBe(1283555108023);
    });


    it('should fake getLocalDateString method', function() {
      //0 in -3h
      var t0 = new angular.mock.TzDate(-3, 0);
      expect(t0.toLocaleDateString()).toMatch('1970');

      //0 in +0h
      var t1 = new angular.mock.TzDate(0, 0);
      expect(t1.toLocaleDateString()).toMatch('1970');

      //0 in +3h
      var t2 = new angular.mock.TzDate(3, 0);
      expect(t2.toLocaleDateString()).toMatch('1969');
    });


    it('should fake toISOString method', function() {
      var date = new angular.mock.TzDate(-1, '2009-10-09T01:02:03.027Z');

      if (new Date().toISOString) {
        expect(date.toISOString()).toEqual('2009-10-09T01:02:03.027Z');
      } else {
        expect(date.toISOString).toBeUndefined();
      }
    });


    it('should fake getHours method', function() {
      //0 in -3h
      var t0 = new angular.mock.TzDate(-3, 0);
      expect(t0.getHours()).toBe(3);

      //0 in +0h
      var t1 = new angular.mock.TzDate(0, 0);
      expect(t1.getHours()).toBe(0);

      //0 in +3h
      var t2 = new angular.mock.TzDate(3, 0);
      expect(t2.getHours()).toMatch(21);
    });


    it('should fake getMinutes method', function() {
      //0:15 in -3h
      var t0 = new angular.mock.TzDate(-3, minutes(15));
      expect(t0.getMinutes()).toBe(15);

      //0:15 in -3.25h
      var t0a = new angular.mock.TzDate(-3.25, minutes(15));
      expect(t0a.getMinutes()).toBe(30);

      //0 in +0h
      var t1 = new angular.mock.TzDate(0, minutes(0));
      expect(t1.getMinutes()).toBe(0);

      //0:15 in +0h
      var t1a = new angular.mock.TzDate(0, minutes(15));
      expect(t1a.getMinutes()).toBe(15);

      //0:15 in +3h
      var t2 = new angular.mock.TzDate(3, minutes(15));
      expect(t2.getMinutes()).toMatch(15);

      //0:15 in +3.25h
      var t2a = new angular.mock.TzDate(3.25, minutes(15));
      expect(t2a.getMinutes()).toMatch(0);
    });


    it('should fake getSeconds method', function() {
      //0 in -3h
      var t0 = new angular.mock.TzDate(-3, 0);
      expect(t0.getSeconds()).toBe(0);

      //0 in +0h
      var t1 = new angular.mock.TzDate(0, 0);
      expect(t1.getSeconds()).toBe(0);

      //0 in +3h
      var t2 = new angular.mock.TzDate(3, 0);
      expect(t2.getSeconds()).toMatch(0);
    });


    it('should fake getMilliseconds method', function() {
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.003Z').getMilliseconds()).toBe(3);
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.023Z').getMilliseconds()).toBe(23);
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.123Z').getMilliseconds()).toBe(123);
    });


    it('should create a date representing new year in Bratislava', function() {
      var newYearInBratislava = new angular.mock.TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(newYearInBratislava.getTimezoneOffset()).toBe(-60);
      expect(newYearInBratislava.getFullYear()).toBe(2010);
      expect(newYearInBratislava.getMonth()).toBe(0);
      expect(newYearInBratislava.getDate()).toBe(1);
      expect(newYearInBratislava.getHours()).toBe(0);
      expect(newYearInBratislava.getMinutes()).toBe(0);
      expect(newYearInBratislava.getSeconds()).toBe(0);
    });


    it('should delegate all the UTC methods to the original UTC Date object', function() {
      //from when created from string
      var date1 = new angular.mock.TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(date1.getUTCFullYear()).toBe(2009);
      expect(date1.getUTCMonth()).toBe(11);
      expect(date1.getUTCDate()).toBe(31);
      expect(date1.getUTCHours()).toBe(23);
      expect(date1.getUTCMinutes()).toBe(0);
      expect(date1.getUTCSeconds()).toBe(0);


      //from when created from millis
      var date2 = new angular.mock.TzDate(-1, date1.getTime());
      expect(date2.getUTCFullYear()).toBe(2009);
      expect(date2.getUTCMonth()).toBe(11);
      expect(date2.getUTCDate()).toBe(31);
      expect(date2.getUTCHours()).toBe(23);
      expect(date2.getUTCMinutes()).toBe(0);
      expect(date2.getUTCSeconds()).toBe(0);
    });


    it('should throw error when no third param but toString called', function() {
      expect(function() { new angular.mock.TzDate(0,0).toString(); }).
                           toThrow('Method \'toString\' is not implemented in the TzDate mock');
    });
  });


  describe('$log', function() {
    var $log;
    beforeEach(inject(['$log', function(log) {
      $log = log;
    }]));

    afterEach(inject(function($log){
      $log.reset();
    }));

    it('should provide log method', function() {
      expect(function() { $log.log(''); }).not.toThrow();
    });

    it('should provide info method', function() {
      expect(function() { $log.info(''); }).not.toThrow();
    });

    it('should provide warn method', function() {
      expect(function() { $log.warn(''); }).not.toThrow();
    });

    it('should provide error method', function() {
      expect(function() { $log.error(''); }).not.toThrow();
    });

    it('should store log messages', function() {
      $log.log('fake log');
      expect($log.log.logs).toContain(['fake log']);
    });

    it('should store info messages', function() {
      $log.info('fake log');
      expect($log.info.logs).toContain(['fake log']);
    });

    it('should store warn messages', function() {
      $log.warn('fake log');
      expect($log.warn.logs).toContain(['fake log']);
    });

    it('should store error messages', function() {
      $log.error('fake log');
      expect($log.error.logs).toContain(['fake log']);
    });

    it('should assertEmpty', function(){
      try {
        $log.error(Error('MyError'));
        $log.warn(Error('MyWarn'));
        $log.info(Error('MyInfo'));
        $log.log(Error('MyLog'));
        $log.assertEmpty();
      } catch (error) {
        error = error.message || error;
        expect(error).toMatch(/Error: MyError/m);
        expect(error).toMatch(/Error: MyWarn/m);
        expect(error).toMatch(/Error: MyInfo/m);
        expect(error).toMatch(/Error: MyLog/m);
      } finally {
        $log.reset();
      }
    });

    it('should reset state', function(){
      $log.error(Error('MyError'));
      $log.warn(Error('MyWarn'));
      $log.info(Error('MyInfo'));
      $log.log(Error('MyLog'));
      $log.reset();
      var passed = false;
      try {
        $log.assertEmpty(); // should not throw error!
        passed = true;
      } catch (e) {
        passed = e;
      }
      expect(passed).toBe(true);
    });
  });


  describe('defer', function() {
    var browser, log;
    beforeEach(inject(function($browser) {
      browser = $browser;
      log = '';
    }));

    function logFn(text){ return function() {
        log += text +';';
      };
    }

    it('should flush', function() {
      browser.defer(logFn('A'));
      expect(log).toEqual('');
      browser.defer.flush();
      expect(log).toEqual('A;');
    });

    it('should flush delayed', function() {
      browser.defer(logFn('A'));
      browser.defer(logFn('B'), 10);
      browser.defer(logFn('C'), 20);
      expect(log).toEqual('');

      expect(browser.defer.now).toEqual(0);
      browser.defer.flush(0);
      expect(log).toEqual('A;');

      browser.defer.flush();
      expect(log).toEqual('A;B;C;');
    });

    it('should defer and flush over time', function() {
      browser.defer(logFn('A'), 1);
      browser.defer(logFn('B'), 2);
      browser.defer(logFn('C'), 3);

      browser.defer.flush(0);
      expect(browser.defer.now).toEqual(0);
      expect(log).toEqual('');

      browser.defer.flush(1);
      expect(browser.defer.now).toEqual(1);
      expect(log).toEqual('A;');

      browser.defer.flush(2);
      expect(browser.defer.now).toEqual(3);
      expect(log).toEqual('A;B;C;');
    });

    it('should throw an exception if there is nothing to be flushed', function() {
      expect(function() {browser.defer.flush();}).toThrow('No deferred tasks to be flushed');
    });
  });


  describe('$exceptionHandler', function() {
    it('should rethrow exceptions', inject(function($exceptionHandler) {
      expect(function() { $exceptionHandler('myException'); }).toThrow('myException');
    }));


    it('should log exceptions', module(function($exceptionHandlerProvider){
      $exceptionHandlerProvider.mode('log');
      var $exceptionHandler = $exceptionHandlerProvider.$get();
      $exceptionHandler('MyError');
      expect($exceptionHandler.errors).toEqual(['MyError']);

      $exceptionHandler('MyError', 'comment');
      expect($exceptionHandler.errors[1]).toEqual(['MyError', 'comment']);
    }));


    it('should throw on wrong argument', module(function($exceptionHandlerProvider) {
      expect(function() {
        $exceptionHandlerProvider.mode('XXX');
      }).toThrow("Unknown mode 'XXX', only 'log'/'rethrow' modes are allowed!");
    }));
  });


  describe('$timeout', function() {
    it('should expose flush method that will flush the pending queue of tasks', inject(
        function($timeout) {
      var logger = [],
          logFn = function(msg) { return function() { logger.push(msg) }};

      $timeout(logFn('t1'));
      $timeout(logFn('t2'), 200);
      $timeout(logFn('t3'));
      expect(logger).toEqual([]);

      $timeout.flush();
      expect(logger).toEqual(['t1', 't3', 't2']);
    }));


    it('should throw an exception when not flushed', inject(function($timeout){
      $timeout(noop);

      var expectedError = 'Deferred tasks to flush (1): {id: 0, time: 0}';
      expect(function() {$timeout.verifyNoPendingTasks();}).toThrow(expectedError);
    }));


    it('should do nothing when all tasks have been flushed', inject(function($timeout) {
      $timeout(noop);

      $timeout.flush();
      expect(function() {$timeout.verifyNoPendingTasks();}).not.toThrow();
    }));
  });


  describe('angular.mock.dump', function(){
    var d = angular.mock.dump;


    it('should serialize primitive types', function(){
      expect(d(undefined)).toEqual('undefined');
      expect(d(1)).toEqual('1');
      expect(d(null)).toEqual('null');
      expect(d('abc')).toEqual('abc');
    });


    it('should serialize element', function(){
      var e = angular.element('<div>abc</div><span>xyz</span>');
      expect(d(e).toLowerCase()).toEqual('<div>abc</div><span>xyz</span>');
      expect(d(e[0]).toLowerCase()).toEqual('<div>abc</div>');
    });

    it('should serialize scope', inject(function($rootScope){
      $rootScope.obj = {abc:'123'};
      expect(d($rootScope)).toMatch(/Scope\(.*\): \{/);
      expect(d($rootScope)).toMatch(/{"abc":"123"}/);
    }));


    it('should be published on window', function(){
      expect(window.dump instanceof Function).toBe(true);
    });
  });


  describe('angular.mock.clearDataCache', function() {
    function keys(obj) {
      var keys = [];
      for(var key in obj) {
        if (obj.hasOwnProperty(key)) keys.push(key);
      }
      return keys.sort();
    }

    function browserTrigger(element, eventType) {
      element = element[0];
      if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false,
          false, false, 0, element);
        element.dispatchEvent(event);
      } else {
        element.fireEvent('on' + eventType);
      }
    }

    it('should remove data', function() {
      expect(angular.element.cache).toEqual({});
      var div = angular.element('<div></div>');
      div.data('name', 'angular');
      expect(keys(angular.element.cache)).not.toEqual([]);
      angular.mock.clearDataCache();
      expect(keys(angular.element.cache)).toEqual([]);
    });

    it('should deregister event handlers', function() {
      expect(keys(angular.element.cache)).toEqual([]);
      var log = '';
      var div = angular.element('<div></div>');

      // crazy IE9 requires div to be connected to render DOM for click event to work
      // mousemove works even when not connected. This is a heisen-bug since stepping
      // through the code makes the test pass. Viva IE!!!
      angular.element(document.body).append(div)

      div.bind('click', function() { log += 'click1;'});
      div.bind('click', function() { log += 'click2;'});
      div.bind('mousemove', function() { log += 'mousemove;'});

      browserTrigger(div, 'click');
      browserTrigger(div, 'mousemove');
      expect(log).toEqual('click1;click2;mousemove;');
      log = '';

      angular.mock.clearDataCache();

      browserTrigger(div, 'click');
      browserTrigger(div, 'mousemove');
      expect(log).toEqual('');
      expect(keys(angular.element.cache)).toEqual([]);

      div.remove();
    });
  });


  describe('jasmine module and inject', function(){
    var log;

    beforeEach(function(){
      log = '';
    });

    describe('module', function() {
      describe('in DSL', function() {
        it('should load module', module(function() {
          log += 'module';
        }));

        afterEach(function() {
          inject();
          expect(log).toEqual('module');
        });
      });


      describe('inline in test', function() {
        it('should load module', function() {
          module(function() {
            log += 'module';
          });
          inject();
        });

        afterEach(function() {
          expect(log).toEqual('module');
        });
      });
    });

    describe('inject', function() {
      describe('in DSL', function() {
        it('should load module', inject(function() {
          log += 'inject';
        }));

        afterEach(function() {
          expect(log).toEqual('inject');
        });
      });


      describe('inline in test', function() {
        it('should load module', function() {
          inject(function() {
            log += 'inject';
          });
        });

        afterEach(function() {
          expect(log).toEqual('inject');
        });
      });

      describe('module with inject', function() {
        beforeEach(module(function(){
          log += 'module;';
        }));

        it('should inject', inject(function() {
          log += 'inject;';
        }));

        afterEach(function() {
          expect(log).toEqual('module;inject;')
        });
      });
    });
  });


  describe('$httpBackend', function() {
    var hb, callback, realBackendSpy;

    beforeEach(inject(function($httpBackend) {
      callback = jasmine.createSpy('callback');
      hb = $httpBackend;
    }));


    it('should respond with first matched definition', function() {
      hb.when('GET', '/url1').respond(200, 'content', {});
      hb.when('GET', '/url1').respond(201, 'another', {});

      callback.andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('content');
      });

      hb('GET', '/url1', null, callback);
      expect(callback).not.toHaveBeenCalled();
      hb.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it('should throw error when unexpected request', function() {
      hb.when('GET', '/url1').respond(200, 'content');
      expect(function() {
        hb('GET', '/xxx');
      }).toThrow('Unexpected request: GET /xxx\nNo more request expected');
    });


    it('should match headers if specified', function() {
      hb.when('GET', '/url', null, {'X': 'val1'}).respond(201, 'content1');
      hb.when('GET', '/url', null, {'X': 'val2'}).respond(202, 'content2');
      hb.when('GET', '/url').respond(203, 'content3');

      hb('GET', '/url', null, function(status, response) {
        expect(status).toBe(203);
        expect(response).toBe('content3');
      });

      hb('GET', '/url', null, function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      }, {'X': 'val1'});

      hb('GET', '/url', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      }, {'X': 'val2'});

      hb.flush();
    });


    it('should match data if specified', function() {
      hb.when('GET', '/a/b', '{a: true}').respond(201, 'content1');
      hb.when('GET', '/a/b').respond(202, 'content2');

      hb('GET', '/a/b', '{a: true}', function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      });

      hb('GET', '/a/b', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      });

      hb.flush();
    });


    it('should match only method', function() {
      hb.when('GET').respond(202, 'c');
      callback.andCallFake(function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('c');
      });

      hb('GET', '/some', null, callback, {});
      hb('GET', '/another', null, callback, {'X-Fake': 'Header'});
      hb('GET', '/third', 'some-data', callback, {});
      hb.flush();

      expect(callback).toHaveBeenCalled();
    });


    it('should preserve the order of requests', function() {
      hb.when('GET', '/url1').respond(200, 'first');
      hb.when('GET', '/url2').respond(201, 'second');

      hb('GET', '/url2', null, callback);
      hb('GET', '/url1', null, callback);

      hb.flush();

      expect(callback.callCount).toBe(2);
      expect(callback.argsForCall[0]).toEqual([201, 'second', '']);
      expect(callback.argsForCall[1]).toEqual([200, 'first', '']);
    });


    describe('respond()', function() {
      it('should take values', function() {
        hb.expect('GET', '/url1').respond(200, 'first', {'header': 'val'});
        hb('GET', '/url1', undefined, callback);
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(200, 'first', 'header: val');
      });

      it('should take function', function() {
        hb.expect('GET', '/some').respond(function(m, u, d, h) {
          return [301, m + u + ';' + d + ';a=' + h.a, {'Connection': 'keep-alive'}];
        });

        hb('GET', '/some', 'data', callback, {a: 'b'});
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(301, 'GET/some;data;a=b', 'Connection: keep-alive');
      });

      it('should default status code to 200', function() {
        callback.andCallFake(function(status, response) {
          expect(status).toBe(200);
          expect(response).toBe('some-data');
        });

        hb.expect('GET', '/url1').respond('some-data');
        hb.expect('GET', '/url2').respond('some-data', {'X-Header': 'true'});
        hb('GET', '/url1', null, callback);
        hb('GET', '/url2', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(2);
      });


      it('should default response headers to ""', function() {
        hb.expect('GET', '/url1').respond(200, 'first');
        hb.expect('GET', '/url2').respond('second');

        hb('GET', '/url1', null, callback);
        hb('GET', '/url2', null, callback);

        hb.flush();

        expect(callback.callCount).toBe(2);
        expect(callback.argsForCall[0]).toEqual([200, 'first', '']);
        expect(callback.argsForCall[1]).toEqual([200, 'second', '']);
      });
    });


    describe('expect()', function() {
      it('should require specified order', function() {
        hb.expect('GET', '/url1').respond(200, '');
        hb.expect('GET', '/url2').respond(200, '');

        expect(function() {
          hb('GET', '/url2', null, noop, {});
        }).toThrow('Unexpected request: GET /url2\nExpected GET /url1');
      });


      it('should have precedence over when()', function() {
        callback.andCallFake(function(status, response) {
          expect(status).toBe(300);
          expect(response).toBe('expect');
        });

        hb.when('GET', '/url').respond(200, 'when');
        hb.expect('GET', '/url').respond(300, 'expect');

        hb('GET', '/url', null, callback, {});
        hb.flush();
        expect(callback).toHaveBeenCalledOnce();
      });


      it ('should throw exception when only headers differs from expectation', function() {
        hb.when('GET').respond(200, '', {});
        hb.expect('GET', '/match', undefined, {'Content-Type': 'application/json'});

        expect(function() {
          hb('GET', '/match', null, noop, {});
        }).toThrow('Expected GET /match with different headers\n' +
                   'EXPECTED: {"Content-Type":"application/json"}\nGOT:      {}');
      });


      it ('should throw exception when only data differs from expectation', function() {
        hb.when('GET').respond(200, '', {});
        hb.expect('GET', '/match', 'some-data');

        expect(function() {
          hb('GET', '/match', 'different', noop, {});
        }).toThrow('Expected GET /match with different data\n' +
                   'EXPECTED: some-data\nGOT:      different');
      });


      it("should use when's respond() when no expect() respond is defined", function() {
        callback.andCallFake(function(status, response) {
          expect(status).toBe(201);
          expect(response).toBe('data');
        });

        hb.when('GET', '/some').respond(201, 'data');
        hb.expect('GET', '/some');
        hb('GET', '/some', null, callback);
        hb.flush();

        expect(callback).toHaveBeenCalled();
        expect(function() { hb.verifyNoOutstandingExpectation(); }).not.toThrow();
      });
    });


    describe('flush()', function() {
      it('flush() should flush requests fired during callbacks', function() {
        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, function() {
          hb('GET', '/other', null, callback);
        });

        hb.flush();
        expect(callback).toHaveBeenCalled();
      });


      it('should flush given number of pending requests', function() {
        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, callback);
        hb('GET', '/some', null, callback);
        hb('GET', '/some', null, callback);

        hb.flush(2);
        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(2);
      });


      it('should throw exception when flushing more requests than pending', function() {
        hb.when('GET').respond(200, '');
        hb('GET', '/url', null, callback);

        expect(function() {hb.flush(2);}).toThrow('No more pending request to flush !');
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should throw exception when no request to flush', function() {
        expect(function() {hb.flush();}).toThrow('No pending request to flush !');

        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, callback);
        hb.flush();

        expect(function() {hb.flush();}).toThrow('No pending request to flush !');
      });


      it('should throw exception if not all expectations satisfied', function() {
        hb.expect('GET', '/url1').respond();
        hb.expect('GET', '/url2').respond();

        hb('GET', '/url1', null, angular.noop);
        expect(function() {hb.flush();}).toThrow('Unsatisfied requests: GET /url2');
      });
    });


    it('should abort requests when timeout promise resolves', function() {
      hb.expect('GET', '/url1').respond(200);

      var canceler, then = jasmine.createSpy('then').andCallFake(function(fn) {
        canceler = fn;
      });

      hb('GET', '/url1', null, callback, null, {then: then});
      expect(typeof canceler).toBe('function');

      canceler();  // simulate promise resolution

      expect(callback).toHaveBeenCalledWith(-1, undefined, '');
      hb.verifyNoOutstandingExpectation();
      hb.verifyNoOutstandingRequest();
    });


    it('should throw an exception if no response defined', function() {
      hb.when('GET', '/test');
      expect(function() {
        hb('GET', '/test', null, callback);
      }).toThrow('No response defined !');
    });


    it('should throw an exception if no response for exception and no definition', function() {
      hb.expect('GET', '/url');
      expect(function() {
        hb('GET', '/url', null, callback);
      }).toThrow('No response defined !');
    });


    it('should respond undefined when JSONP method', function() {
      hb.when('JSONP', '/url1').respond(200);
      hb.expect('JSONP', '/url2').respond(200);

      expect(hb('JSONP', '/url1')).toBeUndefined();
      expect(hb('JSONP', '/url2')).toBeUndefined();
    });


    it('should not have passThrough method', function() {
      expect(hb.passThrough).toBeUndefined();
    });


    describe('verifyExpectations', function() {

      it('should throw exception if not all expectations were satisfied', function() {
        hb.expect('POST', '/u1', 'ddd').respond(201, '', {});
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});

        hb('POST', '/u1', 'ddd', noop, {});

        expect(function() {hb.verifyNoOutstandingExpectation();}).
          toThrow('Unsatisfied requests: GET /u2, POST /u3');
      });


      it('should do nothing when no expectation', function() {
        hb.when('DELETE', '/some').respond(200, '');

        expect(function() {hb.verifyNoOutstandingExpectation();}).not.toThrow();
      });


      it('should do nothing when all expectations satisfied', function() {
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});
        hb.when('DELETE', '/some').respond(200, '');

        hb('GET', '/u2', noop);
        hb('POST', '/u3', noop);

        expect(function() {hb.verifyNoOutstandingExpectation();}).not.toThrow();
      });
    });

    describe('verifyRequests', function() {

      it('should throw exception if not all requests were flushed', function() {
        hb.when('GET').respond(200);
        hb('GET', '/some', null, noop, {});

        expect(function() {
          hb.verifyNoOutstandingRequest();
        }).toThrow('Unflushed requests: 1');
      });
    });


    describe('resetExpectations', function() {

      it('should remove all expectations', function() {
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});
        hb.resetExpectations();

        expect(function() {hb.verifyNoOutstandingExpectation();}).not.toThrow();
      });


      it('should remove all pending responses', function() {
        var cancelledClb = jasmine.createSpy('cancelled');

        hb.expect('GET', '/url').respond(200, '');
        hb('GET', '/url', null, cancelledClb);
        hb.resetExpectations();

        hb.expect('GET', '/url').respond(300, '');
        hb('GET', '/url', null, callback, {});
        hb.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(cancelledClb).not.toHaveBeenCalled();
      });


      it('should not remove definitions', function() {
        var cancelledClb = jasmine.createSpy('cancelled');

        hb.when('GET', '/url').respond(200, 'success');
        hb('GET', '/url', null, cancelledClb);
        hb.resetExpectations();

        hb('GET', '/url', null, callback, {});
        hb.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(cancelledClb).not.toHaveBeenCalled();
      });
    });


    describe('expect/when shortcuts', function() {
      angular.forEach(['expect', 'when'], function(prefix) {
        angular.forEach(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'JSONP'], function(method) {
          var shortcut = prefix + method;
          it('should provide ' + shortcut + ' shortcut method', function() {
            hb[shortcut]('/foo').respond('bar');
            hb(method, '/foo', undefined, callback);
            hb.flush();
            expect(callback).toHaveBeenCalledOnceWith(200, 'bar', '');
          });
        });
      });
    });


    describe('MockHttpExpectation', function() {

      it('should accept url as regexp', function() {
        var exp = new MockHttpExpectation('GET', /^\/x/);

        expect(exp.match('GET', '/x')).toBe(true);
        expect(exp.match('GET', '/xxx/x')).toBe(true);
        expect(exp.match('GET', 'x')).toBe(false);
        expect(exp.match('GET', 'a/x')).toBe(false);
      });


      it('should accept data as regexp', function() {
        var exp = new MockHttpExpectation('POST', '/url', /\{.*?\}/);

        expect(exp.match('POST', '/url', '{"a": "aa"}')).toBe(true);
        expect(exp.match('POST', '/url', '{"one": "two"}')).toBe(true);
        expect(exp.match('POST', '/url', '{"one"')).toBe(false);
      });


      it('should ignore data only if undefined (not null or false)', function() {
        var exp = new MockHttpExpectation('POST', '/url', null);
        expect(exp.matchData(null)).toBe(true);
        expect(exp.matchData('some-data')).toBe(false);

        exp = new MockHttpExpectation('POST', '/url', undefined);
        expect(exp.matchData(null)).toBe(true);
        expect(exp.matchData('some-data')).toBe(true);
      });


      it('should accept headers as function', function() {
        var exp = new MockHttpExpectation('GET', '/url', undefined, function(h) {
          return h['Content-Type'] == 'application/json';
        });

        expect(exp.matchHeaders({})).toBe(false);
        expect(exp.matchHeaders({'Content-Type': 'application/json', 'X-Another': 'true'})).toBe(true);
      });
    });
  });


  describe('$rootElement', function() {
    it('should create mock application root', inject(function($rootElement) {
      expect($rootElement.text()).toEqual('');
    }));
  });
});


describe('ngMockE2E', function() {
  describe('$httpBackend', function() {
    var hb, realHttpBackend, callback;

    beforeEach(function() {
      module(function($provide) {
        callback = jasmine.createSpy('callback');
        realHttpBackend = jasmine.createSpy('real $httpBackend');
        $provide.value('$httpBackend', realHttpBackend);
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
      });
      inject(function($injector) {
        hb = $injector.get('$httpBackend');
      });
    });


    describe('passThrough()', function() {
      it('should delegate requests to the real backend when passThrough is invoked', function() {
        hb.when('GET', /\/passThrough\/.*/).passThrough();
        hb('GET', '/passThrough/23', null, callback);

        expect(realHttpBackend).toHaveBeenCalledOnceWith(
            'GET', '/passThrough/23', null, callback, undefined, undefined);
      });
    });


    describe('autoflush', function() {
      it('should flush responses via $browser.defer', inject(function($browser) {
        hb.when('GET', '/foo').respond('bar');
        hb('GET', '/foo', null, callback);

        expect(callback).not.toHaveBeenCalled();
        $browser.defer.flush();
        expect(callback).toHaveBeenCalledOnce();
      }));
    });
  });
});
