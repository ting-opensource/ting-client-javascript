(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileMetadata = (function () {
        function FileMetadata(data) {
            this.key = '';
            this.originalName = '';
            this.contentType = '';
            this.url = '';
            this.createdAt = null;
            this.updatedAt = null;
            for (var key in data) {
                this[key] = data[key];
            }
        }
        return FileMetadata;
    }());
    exports.FileMetadata = FileMetadata;
});
//# sourceMappingURL=FileMetadata.js.map