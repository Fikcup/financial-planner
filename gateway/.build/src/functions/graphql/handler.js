"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_lambda_1 = require("apollo-server-lambda");
var gateway_1 = require("@apollo/gateway");
var fs_1 = require("fs");
var AuthenticatedDataSource = /** @class */ (function (_super) {
    __extends(AuthenticatedDataSource, _super);
    function AuthenticatedDataSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthenticatedDataSource.prototype.willSendRequest = function (_a) {
        var request = _a.request, context = _a.context;
        // Pass the user's id from the context to each subgraph
        // as a header called `user-id`
        request.http.headers.set('user-id', context.userId);
    };
    return AuthenticatedDataSource;
}(gateway_1.RemoteGraphQLDataSource));
var supergraphSdl = (0, fs_1.readFileSync)('./supergraph.graphql').toString();
var gateway = new gateway_1.ApolloGateway({
    supergraphSdl: supergraphSdl,
    //highlight-start
    buildService: function (_a) {
        var name = _a.name, url = _a.url;
        return new AuthenticatedDataSource({ url: url });
    },
    //highlight-end
});
var server = new apollo_server_lambda_1.ApolloServer({
    debug: process.env.STAGE !== "prod",
    gateway: gateway,
    apollo: {
        key: process.env.APOLLO_KEY,
        graphVariant: process.env.GRAPH_VARIANT,
        graphId: "monetaryiq",
    },
    context: function (_a) {
        var event = _a.event;
        return __awaiter(void 0, void 0, void 0, function () {
            var transformed, authorization, cookie, token;
            return __generator(this, function (_b) {
                transformed = transformHeaders(event.headers);
                authorization = transformed.authorization, cookie = transformed.cookie;
                token = authorization || '';
                // Try to retrieve a user with the token
                // TODO: implement user id fetch from token
                // const userId = getUserId(token);
                // Add the user ID to the contextValue
                return [2 /*return*/, { userId: 5 }];
            });
        });
    },
    //highlight-end
});
function transformHeaders(headers) {
    return Object.entries(headers).reduce(function (headers, _a) {
        var _b;
        var header = _a[0], value = _a[1];
        return (__assign(__assign({}, headers), (_b = {}, _b[header.toLowerCase()] = value, _b)));
    }, {});
}
exports.graphqlHandler = server.createHandler({
    expressGetMiddlewareOptions: {
        bodyParserConfig: {
            limit: "5mb",
        },
        cors: {
            origin: ["https://studio.apollographql.com"],
            credentials: true,
        },
    },
});
//# sourceMappingURL=handler.js.map