"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationAction = exports.client = void 0;
const next_config_1 = require("@graphcommerce/next-config");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("./client");
const log_functions_1 = require("./log-functions");
dotenv_1.default.config();
const config = (0, next_config_1.loadConfig)(process.cwd());
exports.client = (0, client_1.initClient)(config, undefined);
/**
 * This constant is used to assign the right action of the management SDK to the migratioAction
 * function
 */
const actionMap = exports.client
    ? {
        create: {
            model: (innerprops) => exports.client.createModel(innerprops),
            component: (innerprops) => exports.client.createComponent(innerprops),
            enumeration: (innerprops) => exports.client.createEnumeration(innerprops),
            simpleField: (innerprops) => exports.client.createSimpleField(innerprops),
            enumerableField: (innerprops) => exports.client.createEnumerableField(innerprops),
            componentField: (innerprops) => exports.client.createComponentField(innerprops),
            relationalField: (innerprops) => exports.client.createRelationalField(innerprops),
            unionField: (innerprops) => exports.client.createUnionField(innerprops),
            componentUnionField: (innerprops) => exports.client.createComponentUnionField(innerprops),
        },
        update: {
            model: (innerprops) => exports.client.updateModel(innerprops),
            component: (innerprops) => exports.client.updateComponent(innerprops),
            enumeration: (innerprops) => exports.client.updateEnumeration(innerprops),
            simpleField: (innerprops) => exports.client.updateSimpleField(innerprops),
            enumerableField: (innerprops) => exports.client.updateEnumerableField(innerprops),
            componentField: (innerprops) => exports.client.updateComponentField(innerprops),
            relationalField: (innerprops) => exports.client.updateRelationalField(innerprops),
            unionField: (innerprops) => exports.client.updateUnionField(innerprops),
            componentUnionField: (innerprops) => exports.client.updateComponentUnionField(innerprops),
        },
        delete: {
            model: (innerprops) => exports.client.deleteModel(innerprops),
            component: (innerprops) => exports.client.deleteComponent(innerprops),
            enumeration: (innerprops) => exports.client.deleteEnumeration(innerprops),
            simpleField: (innerprops) => exports.client.deleteField(innerprops),
            enumerableField: (innerprops) => exports.client.deleteField(innerprops),
            componentField: (innerprops) => exports.client.deleteField(innerprops),
            relationalField: (innerprops) => exports.client.deleteField(innerprops),
            unionField: (innerprops) => exports.client.deleteField(innerprops),
            componentUnionField: (innerprops) => exports.client.deleteField(innerprops),
        },
    }
    : undefined;
/**
 * This function is our variation on the client.migrationAction functions from the hygraph
 * management sdk.
 *
 * MigrationAction() is better suited because it is a single function for all actions. More
 * importantly, if the action fails, because a field with the apiID already exists for instance. it
 * will skip this action but still continue the whole migration, while the management sdk function
 * will bail.
 *
 * It takes the schema as argument, which is always the same.
 *
 * Then it takes the type of schema entity you want to do an action upon, and the action you want to
 * do.
 *
 * The fourth arguments are the props that belong to the action you want to do. For instance, if you
 * want to create a model, you need to pass the props that belong to a model.
 *
 * The last two arguments are optional. If you want to create a field, you need to pass the apiId of
 * the model or component you want to create the field on. If you want to create a field on a
 * component, you also need to pass the parentType, which is either 'model' or 'component'.
 */
const migrationAction = (schema, type, action, props, parentApiId, parentType) => {
    /**
     * Check if the entity already exists.
     * If an update or deletion is made, it does not matter if the entity already exists
     */
    const alreadyExists = () => {
        if (action !== 'create') {
            return false;
        }
        switch (type) {
            case 'model':
                return schema.models.some((model) => model.apiId === props.apiId);
            case 'component':
                return schema.components.some((component) => component.apiId === props.apiId);
            case 'enumeration':
                return schema.enumerations.some((enumeration) => enumeration.apiId === props.apiId);
            case 'simpleField':
            case 'enumerableField':
            case 'relationalField':
            case 'unionField':
            case 'componentUnionField': {
                let parent;
                switch (parentType) {
                    case 'model': {
                        parent = schema.models.find((model) => model.apiId === parentApiId);
                        break;
                    }
                    case 'component': {
                        parent = schema.components.find((component) => component.apiId === parentApiId);
                        break;
                    }
                    default:
                        return false;
                }
                return parent?.fields.some((field) => field.apiId === props.apiId);
            }
            default: {
                return false;
            }
        }
    };
    const actionFunc = actionMap && actionMap[action] && actionMap[action][type];
    if (!alreadyExists()) {
        if (actionFunc) {
            (0, log_functions_1.graphcommerceLog)(`${(0, log_functions_1.capitalize)(action)} ${type} with apiId ${props.apiId}...`);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore | This error is a loss on typescript autocomplete, but the function is called correctly
            actionFunc(props);
        }
        else {
            (0, log_functions_1.graphcommerceLog)(`Action ${action} is not supported for ${type}`, 'error');
        }
    }
    else {
        (0, log_functions_1.graphcommerceLog)(`${(0, log_functions_1.capitalize)(type)} with apiId ${props.apiId} on ${parentApiId} already exists`, 'warning');
    }
};
exports.migrationAction = migrationAction;
