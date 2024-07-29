"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypeDefinitionBuilder = exports.isInput = exports.isNamedType = exports.isNonNullType = exports.isListType = void 0;
const isListType = (typ) => typ?.kind === 'ListType';
exports.isListType = isListType;
const isNonNullType = (typ) => typ?.kind === 'NonNullType';
exports.isNonNullType = isNonNullType;
const isNamedType = (typ) => typ?.kind === 'NamedType';
exports.isNamedType = isNamedType;
const isInput = (kind) => kind.includes('Input');
exports.isInput = isInput;
const ObjectTypeDefinitionBuilder = (useObjectTypes, callback) => {
    if (!useObjectTypes)
        return undefined;
    return (node) => {
        if (/^(Query|Mutation|Subscription)$/.test(node.name.value)) {
            return undefined;
        }
        return callback(node);
    };
};
exports.ObjectTypeDefinitionBuilder = ObjectTypeDefinitionBuilder;
