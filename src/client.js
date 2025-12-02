"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionStatus = getConnectionStatus;
exports.spawnMachine = spawnMachine;
exports.terminateMachine = terminateMachine;
exports.resetMachine = resetMachine;
exports.extendMachine = extendMachine;
exports.submitMachineFlag = submitMachineFlag;
exports.getMachine = getMachine;
exports.getActiveMachine = getActiveMachine;
exports.getPwnboxStatus = getPwnboxStatus;
exports.getPwnboxUsage = getPwnboxUsage;
exports.terminatePwnbox = terminatePwnbox;
exports.extendPwnbox = extendPwnbox;
exports.getProLabs = getProLabs;
exports.getProLabInfo = getProLabInfo;
exports.submitProLabFlag = submitProLabFlag;
exports.requestProLabReset = requestProLabReset;
exports.getUserProLabProgress = getUserProLabProgress;
exports.getUserMachineProgress = getUserMachineProgress;
var axios_1 = __importDefault(require("axios"));
var API_BASE_URL = "https://www.hackthebox.com/api";
var USER_AGENT = "htb-operator-ts/1.0.0";
function makeRequest(apiKey_1, method_1, endpoint_1, data_1) {
    return __awaiter(this, arguments, void 0, function (apiKey, method, endpoint, data, apiVersion) {
        var url, config, response, error_1, axiosError;
        if (apiVersion === void 0) { apiVersion = 'v4'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(API_BASE_URL, "/").concat(apiVersion, "/").concat(endpoint);
                    config = {
                        method: method,
                        url: url,
                        headers: {
                            'Authorization': "Bearer ".concat(apiKey),
                            'User-Agent': USER_AGENT,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: data
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, axios_1.default)(config)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 3:
                    error_1 = _a.sent();
                    if (axios_1.default.isAxiosError(error_1)) {
                        axiosError = error_1;
                        if (axiosError.response && axiosError.response.data) {
                            throw new Error(axiosError.response.data.message || JSON.stringify(axiosError.response.data));
                        }
                        throw new Error(axiosError.message);
                    }
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Connection
function getConnectionStatus(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // The python code calls `connection/status` and returns a list of VpnConnection
            return [2 /*return*/, makeRequest(apiKey, 'GET', 'connection/status')];
        });
    });
}
// Machine Control
function spawnMachine(apiKey, machineId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'POST', 'vm/spawn', { machine_id: machineId })];
                case 1:
                    response = _a.sent();
                    // Python logic: if "success" in data and data["success"] == '0', return False, message
                    // if "success" not in data, return True, message
                    // But usually it returns { success: "1", message: "..." } or { success: "0", message: "..." }
                    // Let's just return the raw response or normalize it.
                    // The user asked for "Turn on machine", so returning success/fail is good.
                    if (response.success === '0' || response.success === false) {
                        return [2 /*return*/, { success: false, message: response.message || 'Failed to spawn machine' }];
                    }
                    return [2 /*return*/, { success: true, message: response.message || 'Machine spawned' }];
            }
        });
    });
}
function terminateMachine(apiKey, machineId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'POST', 'vm/terminate', { machine_id: machineId })];
                case 1:
                    response = _a.sent();
                    if (response.success === '0' || response.success === false) {
                        return [2 /*return*/, { success: false, message: response.message || 'Failed to terminate machine' }];
                    }
                    return [2 /*return*/, { success: true, message: response.message || 'Machine terminated' }];
            }
        });
    });
}
function resetMachine(apiKey, machineId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'POST', 'vm/reset', { machine_id: machineId })];
                case 1:
                    response = _a.sent();
                    if (response.success === '0' || response.success === false) {
                        return [2 /*return*/, { success: false, message: response.message || 'Failed to reset machine' }];
                    }
                    return [2 /*return*/, { success: true, message: response.message || 'Machine reset requested' }];
            }
        });
    });
}
function extendMachine(apiKey, machineId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'POST', 'vm/extend', { machine_id: machineId })];
                case 1:
                    response = _a.sent();
                    if (response.success === '0' || response.success === false) {
                        return [2 /*return*/, { success: false, message: response.message || 'Failed to extend machine' }];
                    }
                    return [2 /*return*/, { success: true, message: response.message || 'Machine extended' }];
            }
        });
    });
}
function submitMachineFlag(apiKey, machineId, flag) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'POST', 'machine/own', { machine_id: machineId, flag: flag }, 'v5')];
                case 1:
                    response = _a.sent();
                    if (response.success === '0' || response.success === false) {
                        return [2 /*return*/, { success: false, message: response.message || 'Failed to submit flag' }];
                    }
                    return [2 /*return*/, { success: true, message: response.message || 'Flag submitted' }];
            }
        });
    });
}
function getMachine(apiKey, machineId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'GET', "machine/profile/".concat(machineId))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.info];
            }
        });
    });
}
function getActiveMachine(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'GET', 'machine/active')];
                case 1:
                    response = _a.sent();
                    if (!response.info)
                        return [2 /*return*/, null];
                    return [2 /*return*/, response.info];
            }
        });
    });
}
// Pwnbox
function getPwnboxStatus(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'GET', 'pwnbox/status')];
                case 1:
                    response = _a.sent();
                    if (response.message) {
                        // "message" usually implies no pwnbox active or error, python raises NoPwnBoxActiveException
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, response.data];
            }
        });
    });
}
function getPwnboxUsage(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'GET', 'pwnbox/usage')];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    });
}
function terminatePwnbox(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'POST', 'pwnbox/terminate')];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        return [2 /*return*/, { success: false, message: response.error }];
                    }
                    return [2 /*return*/, { success: true, message: 'Pwnbox terminated' }];
            }
        });
    });
}
function extendPwnbox(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, makeRequest(apiKey, 'POST', 'pwnbox/extend')];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, { success: true, message: response.message || 'Pwnbox extended' }];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, { success: false, message: e_1.message }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ProLabs
function getProLabs(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'GET', 'prolabs')];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data.labs];
            }
        });
    });
}
function getProLabInfo(apiKey, proLabId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'GET', "prolab/".concat(proLabId, "/info"))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data]; // This might be partial info, but let's see.
            }
        });
    });
}
function submitProLabFlag(apiKey, proLabId, flag) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'POST', "prolab/".concat(proLabId, "/flag"), { flag: flag })];
                case 1:
                    response = _a.sent();
                    if (response.message) {
                        // Usually if message is returned it's success or error, check status code or content
                        // Python: returns True, data["message"]
                        return [2 /*return*/, { success: true, message: response.message }];
                    }
                    return [2 /*return*/, { success: false, message: 'Unknown response' }];
            }
        });
    });
}
function requestProLabReset(apiKey, proLabId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, makeRequest(apiKey, 'POST', "prolab/".concat(proLabId, "/reset"))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, { success: true, message: response.message || 'Reset requested' }];
                case 2:
                    e_2 = _a.sent();
                    return [2 /*return*/, { success: false, message: e_2.message }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// User Progress
function getUserProLabProgress(apiKey, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'GET', "user/profile/progress/prolab/".concat(userId))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.profile.prolabs];
            }
        });
    });
}
function getUserMachineProgress(apiKey, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeRequest(apiKey, 'GET', "user/profile/progress/machines/os/".concat(userId))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.profile.operating_systems];
            }
        });
    });
}
