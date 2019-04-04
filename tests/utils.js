const utils = require("../lib/utils");
const chai = require("chai");
const expect = chai.expect;

describe("Testing utils.isObject", function () {

    it("object", function () {
        expect(utils.isObject({})).to.be.true;
    });

    it("Object.create(null)", function () {
        expect(utils.isObject(Object.create(null))).to.be.true;
    });

    it("function", function () {
        expect(utils.isObject(function(){})).to.be.false;
    });

    it("array", function () {
        expect(utils.isObject([])).to.be.false;
    });

    it("regexp", function () {
        expect(utils.isObject(/^a/)).to.be.false;
    });

    it("Error", function () {
        expect(utils.isObject(new Error())).to.be.false;
    });

    it("Date", function () {
        expect(utils.isObject(new Date)).to.be.false;
    });

    it("boolean", function () {
        expect(utils.isObject(true)).to.be.false;
    });

    it("number", function () {
        expect(utils.isObject(1)).to.be.false;
    });

    it("String", function () {
        expect(utils.isObject("ITSA")).to.be.false;
    });

    it("null", function () {
        expect(utils.isObject(null)).to.be.false;
    });

    it("undefined", function () {
        expect(utils.isObject(undefined)).to.be.false;
    });

    it("Promise", function () {
        expect(utils.isObject(Promise.resolve())).to.be.false;
    });

});

describe("Testing utils.clone", function () {
    const deepObj = {
        a: 1,
        b: [10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)],
        c: new Date(2015, 2, 1, 12, 30, 0, 0),
        d: {
            d1: 1,
            d2: true,
            d3: "ITSA modules",
            d4: new Date(2015, 3, 1, 12, 30, 0, 0),
            d5: {
                    d51: true
                },
            d6: [
                    "more modules"
                ]
            },
        e: true,
        f: "ITSA"
    };

    it("clone", function () {
        var a = {};
        utils.clone(deepObj, a);
        expect(a).be.eql(deepObj);
        expect(a===deepObj).to.be.false;

        a.a = 42;
        expect(a.a).be.equal(42);
        expect(deepObj.a).be.equal(1);

        a.b[0] = 2;
        a.b[1] = 5;
        a.b[2] = 20;
        a.b[3].b1 = false;
        a.b[4][0] = "second item";
        a.b[5] = new Date(2016, 1, 1, 12, 30, 0, 0);
        expect(a.b).to.be.eql([2, 5, 20, {b1: false}, ["second item"], new Date(2016, 1, 1, 12, 30, 0, 0)]);
        expect(deepObj.b).to.be.eql([10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]);

        a.c = "ITSA";
        expect(a.c).be.equal("ITSA");
        expect(deepObj.c).to.be.eql(new Date(2015, 2, 1, 12, 30, 0, 0));

        a.e = "Mod";
        expect(a.e).be.equal("Mod");
        expect(deepObj.e).be.equal(true);

        a.d.d1 = 2;
        a.d.d2 = 3;
        a.d.d3 = 4;
        a.d.d4 = 5;
        a.d.d5.d51 = 6;
        a.d.d6[0] = 7;
        expect(a.d).to.be.eql({d1:2, d2:3, d3:4, d4:5, d5: {d51: 6}, d6: [7]});
        expect(deepObj.d).to.be.eql({d1:1, d2:true, d3:"ITSA modules", d4:new Date(2015, 3, 1, 12, 30, 0, 0), d5: {d51: true}, d6: ["more modules"]});

        a.f = 4;
        expect(a.f).be.equal(4);
        expect(deepObj.f).be.equal("ITSA");

        a.h = 10;
        expect(deepObj.h===undefined).to.be.true;

        deepObj.i = 10;
        expect(a.i===undefined).to.be.true;
        delete deepObj.i;

        // also check date not to be cloned
        var obj = {date: new Date()};
        obj.date.setMinutes(1);

        var cloned = {};
        utils.clone(obj, cloned);

        expect(obj.date.getTime()===cloned.date.getTime()).to.be.true;
        obj.date.setMinutes(2);
        expect(obj.date.getTime()===cloned.date.getTime()).to.be.false;
    });
});

describe("Testing utils.differentTypes", function () {
    it("should be the same on two numbers", function () {
        expect(utils.differentTypes(1, 2)).to.be.false;
    });

    it("should be the same on two booleans", function () {
        expect(utils.differentTypes(true, false)).to.be.false;
    });

    it("should be the same on two null values", function () {
        expect(utils.differentTypes(null, null)).to.be.false;
    });

    it("should be the same on two undefined values", function () {
        expect(utils.differentTypes(undefined, undefined)).to.be.false;
    });

    it("should be the same on two objects", function () {
        expect(utils.differentTypes({a: 10}, {a: 15})).to.be.false;
    });

    it("should be the same on two arrays", function () {
        expect(utils.differentTypes([1, 2], [3, 4])).to.be.false;
    });

    it("should be the same on two Dates", function () {
        let d1 = new Date(),
            d2 = new Date(d1.getTime() - 100);
        expect(utils.differentTypes(d1, d2)).to.be.false;
    });

    it("should be the same on two promises", function () {
        expect(utils.differentTypes(Promise.resolve(1), Promise.resolve(2))).to.be.false;
    });

    it("should be different on number and boolean", function () {
        expect(utils.differentTypes(1, true)).to.be.true;
    });

    it("should be different on number and null", function () {
        expect(utils.differentTypes(1, null)).to.be.true;
    });

    it("should be different on number and undefined", function () {
        expect(utils.differentTypes(1, undefined)).to.be.true;
    });

    it("should be different on number and object", function () {
        expect(utils.differentTypes(1, {})).to.be.true;
    });

    it("should be different on number and array", function () {
        expect(utils.differentTypes(1, [])).to.be.true;
    });

    it("should be different on number and date", function () {
        expect(utils.differentTypes(1, new Date())).to.be.true;
    });

    it("should be different on object and boolean", function () {
        expect(utils.differentTypes({}, true)).to.be.true;
    });

    it("should be different on object and null", function () {
        expect(utils.differentTypes({}, null)).to.be.true;
    });

    it("should be different on object and undefined", function () {
        expect(utils.differentTypes({}, undefined)).to.be.true;
    });

    it("should be different on object and array", function () {
        expect(utils.differentTypes({}, [])).to.be.true;
    });

    it("should be different on object and date", function () {
        expect(utils.differentTypes({}, new Date())).to.be.true;
    });

    it("should be different on object and a promise", function () {
        expect(utils.differentTypes({}, Promise.resolve())).to.be.true;
    });
});

describe("Testing utils.checkPropertyDif", function () {
    it("have no difference on same member", function () {
        let master = {
                a: 10,
                b: 15
            },
            sub = {
                b: 15
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.false;
    });

    it("have no difference on same sub-object", function () {
        let master = {
                a: 10,
                b: {b1: 15}
            },
            sub = {
                b: {b1: 15}
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.false;
    });

    it("have no difference on same sub-array", function () {
        let master = {
                a: 10,
                b: [1, 2]
            },
            sub = {
                b: [1, 2]
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.false;
    });

    it("have no difference on same sub-object with nested array", function () {
        let master = {
                a: 10,
                b: {
                    b1: 15,
                    b2: [1, 2]
                }
            },
            sub = {
                b: {
                    b1: 15,
                    b2: [1, 2]
                }
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.false;
    });

    it("have no difference on same sub-array with object", function () {
        let master = {
                a: 10,
                b: [
                    1,
                    2,
                    {b1: 10}
                ]
            },
            sub = {
                b: [
                    1,
                    2,
                    {b1: 10}
                ]
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.false;
    });

    it("have difference on different member", function () {
        let master = {
                a: 10,
                b: 15
            },
            sub = {
                b: 12
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on different sub-object", function () {
        let master = {
                a: 10,
                b: {b1: 15}
            },
            sub = {
                b: {b1: 25}
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on different sub-array", function () {
        let master = {
                a: 10,
                b: [1, 2]
            },
            sub = {
                b: [1, 3]
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on sub-object with different nested array", function () {
        let master = {
                a: 10,
                b: {
                    b1: 15,
                    b2: [1, 2]
                }
            },
            sub = {
                b: {
                    b1: 15,
                    b2: [1, 3]
                }
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on sub-array with different object", function () {
        let master = {
                a: 10,
                b: [
                    1,
                    2,
                    {b1: 10}
                ]
            },
            sub = {
                b: [
                    1,
                    2,
                    {b1: 15}
                ]
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on sub-object with partial different nested array", function () {
        let master = {
                a: 10,
                b: {
                    b1: 15,
                    b2: [1, 2]
                }
            },
            sub = {
                b: {
                    b1: 15,
                    b2: [1, 3]
                }
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on sub-array with partial different object", function () {
        let master = {
                a: 10,
                b: [
                    1,
                    2,
                    {b1: 10, b2: 12}
                ]
            },
            sub = {
                b: [
                    1,
                    2,
                    {b1: 10, b2: 15}
                ]
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on new member", function () {
        let master = {
                a: 10,
                b: 15
            },
            sub = {
                c: 12
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on new sub-object item", function () {
        let master = {
                a: 10,
                b: {b1: 15}
            },
            sub = {
                b: {b1: 15, b2: 3}
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on new sub-array item", function () {
        let master = {
                a: 10,
                b: [1, 2]
            },
            sub = {
                b: [1, 2, 3]
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on sub-object with new nested array", function () {
        let master = {
                a: 10,
                b: {
                    b1: 15,
                    b2: [1, 2]
                }
            },
            sub = {
                b: {
                    b1: 15,
                    b2: [1, 2, 3]
                }
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });

    it("have difference on sub-array with new object", function () {
        let master = {
                a: 10,
                b: [
                    1,
                    2,
                    {b1: 10}
                ]
            },
            sub = {
                b: [
                    1,
                    2,
                    {b1: 10, b2: 15}
                ]
            };
        expect(utils.checkPropertyDif(master, sub)).to.be.true;
    });
});

describe("Testing utils.merge", function () {
    const obj = {
        a:1,
        b:2,
        c: {
            c1: 3,
            c2: 5
        },
        d: [1,2,3]
    };
    let objCopy = {};
    utils.clone(obj, objCopy);

    it("check copy", function () {
        var a = {};
        utils.merge(obj, a);
        expect(a).be.eql(obj);
        expect(obj).be.eql(objCopy);
    });
    it("check overwrite simple property",  function () {
        var target = {},
            newValue = {b:5};
        utils.clone(obj, target);
        utils.merge(newValue, target);
        expect(target).be.eql({a:1,b:5,c:{c1: 3,c2: 5}, d: [1,2,3]});
        expect(newValue).be.eql({b:5});
        expect(obj).be.eql(objCopy);
    });
    it("check overwrite array",  function () {
        var target = {},
            newValue = {d:[6,7]};
        utils.clone(obj, target);
        utils.merge(newValue, target, true);
        expect(target).be.eql({a:1,b:2,c:{c1: 3,c2:5}, d: [6,7]});
        expect(newValue).be.eql({d:[6,7]});
        expect(obj).be.eql(objCopy);
    });
    it("check overwrite full object",  function () {
        var target = {},
            newValue = {c:{c1:8}};
        utils.clone(obj, target);
        utils.merge(newValue, target, true);
        expect(target).be.eql({a:1,b:2,c:{c1: 8}, d: [1,2,3]});
        expect(newValue).be.eql({c:{c1:8}});
        expect(obj).be.eql(objCopy);
    });
    it("check overwrite parial object",  function () {
        var target = {},
            newValue = {c:{c1:8}};
        utils.clone(obj, target);
        utils.merge(newValue, target);
        expect(target).be.eql({a:1,b:2,c:{c1: 8, c2: 5}, d: [1,2,3]});
        expect(newValue).be.eql({c:{c1:8}});
        expect(obj).be.eql(objCopy);
    });
});
