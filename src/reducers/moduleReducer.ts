import { IState, IModule, IModuleData } from '../component/interface';
import {
    ADD_MODULE,
    REFRESH_MODULE,
    REFRESH_MODULE_LIST,
    REMOVE_MODULE,
    UPDATE_MODULE,
    FOCUS_MODULE,
    POSITION_MODULE,
    MODULE_TOP_CHANGE,
    MODULE_HEIGHT_CHANGE,
    ALL_MODULE_TOP_CHANGE,
    COPY_MODULE,
} from '../actions';

import '../component/interface';
import { access } from 'fs';

export default (state: IModule = { moduleList: [] }, action: any) => {
    switch (action.type) {
        case ADD_MODULE:
            {
                const { preModuleId, moduleData } = action;
                // 添加tempData
                moduleData.tempData = {
                    isActive: true,
                };
                let newModuleList;
                if (preModuleId === undefined) {
                    newModuleList = state.moduleList.concat([moduleData]);
                } else {
                    const init: IModuleData[] = [];
                    newModuleList = state.moduleList.reduce((acc, v: IModuleData, i, array) => {
                        acc.push(v);
                        if (v.moduleId === preModuleId) {
                            acc.push(moduleData);
                        }
                        return acc;
                    }, init);
                }
                newModuleList = newModuleList.map(v => {
                    if (v.moduleId === moduleData.moduleId) {
                        v.tempData.isActive = true;
                    } else {
                        v.tempData.isActive = false;
                    }
                    return v;
                });
                const result = Object.assign({}, state, { moduleList: newModuleList });
                return result;
            }
        case REFRESH_MODULE_LIST: // 刷新整页
            {
                const { moduleList } = action;
                return {
                    moduleList: moduleList.map((v: IModuleData) => {
                        return Object.assign({}, v, {
                            tempData: {
                                isActive: false,
                                top: 0,
                                height: 0,
                            },
                        });
                    }),
                };
            }

        case REMOVE_MODULE: // 删除模块
            {
                const { moduleId } = action;
                let result;
                if (state.moduleList) {
                    return Object.assign({}, state, {
                        moduleList: state.moduleList.filter(v => v.moduleId !== moduleId),
                    });
                } else {
                    return state;
                }
            }
            break;
        case UPDATE_MODULE: // 更新模块
            const { moduleData } = action;
            if (moduleData) {
                const { moduleId } = moduleData;
                const result = Object.assign({}, state, {
                    moduleList: state.moduleList.map((v) => {
                        if (v.moduleId === moduleId) {
                            moduleData.tempData = v.tempData; // 带上临时数据
                            return moduleData;
                        } else {
                            return v;
                        }
                    }),
                });
                return result;
            }
        case FOCUS_MODULE: // 聚焦模块
            {
                const { moduleId } = action;
                const result = Object.assign({}, state, {
                    moduleList: state.moduleList.map(v => {
                        v.moduleId === moduleId ?
                            v.tempData = Object.assign({}, v.tempData, { isActive: true }) :
                            v.tempData = Object.assign({}, v.tempData, { isActive: false });
                        return v;
                    }),
                });
                return result;
            }
        case POSITION_MODULE: // 移动模块
            {
                const { moduleId, preModuleId } = action;
                let { newModuleList, module } = state.moduleList.reduce((acc, v) => {
                    if (v.moduleId === moduleId) {
                        acc.module = v;
                    } else {
                        acc.newModuleList.push(v);
                    }
                    return acc;
                }, ({
                    newModuleList: [],
                    module: undefined,
                }) as any);
                // 如果移到第一个位置
                if (preModuleId === undefined) {
                    newModuleList = [module].concat(newModuleList);
                } else {
                    const preModuleIndex = newModuleList.findIndex((v: IModuleData) => v.moduleId === preModuleId);
                    newModuleList.splice(preModuleIndex + 1, 0, module);
                }
                const result = Object.assign({}, state, {
                    moduleList: newModuleList,
                });
                return result;
            }
        case MODULE_TOP_CHANGE: // 模块top值变化
            {
                const { moduleId, top } = action;
                const newModuleList = state.moduleList.map(v => {
                    if (v.moduleId === moduleId) {
                        v.tempData = Object.assign({}, v.tempData, { top });
                    }
                    return v;
                });
                const result = Object.assign({}, state, {
                    moduleList: newModuleList,
                });
                return result;
            }
        case ALL_MODULE_TOP_CHANGE: //  刷新某模块之后所有模块top值
            {
                const { afterModuleId, topChange } = action;
                let shouldChange = false;
                const newModuleList = state.moduleList.reduce((acc: IModuleData[], v: IModuleData) => {
                    if (shouldChange === true) {
                        v.tempData.top += topChange;
                    }
                    // 该模块之后的模块top值都要发生变化
                    if (v.moduleId === afterModuleId) {
                        shouldChange = true;
                    }
                    acc.push(v);
                    return acc;
                }, []);
                const result = Object.assign({}, state, {
                    moduleList: newModuleList,
                });
                return result;
            }
        case MODULE_HEIGHT_CHANGE: // 模块height值变化
            {
                const { moduleId, height } = action;
                const newModuleList = state.moduleList.map(v => {
                    if (v.moduleId === moduleId) {
                        v.tempData = Object.assign({}, v.tempData, { height });
                    }
                    return v;
                });
                const result = Object.assign({}, state, {
                    moduleList: newModuleList,
                });
                return result;
            }
        case COPY_MODULE:
            {
                const { prevModuleId, moduleData } = action;
                // 添加tempData
                moduleData.tempData = {
                    isActive: true,
                };
                const newModuleList = state.moduleList.reduce((acc: IModuleData[], v: IModuleData) => {
                    acc.push(v);
                    if (v.moduleId === prevModuleId) {
                        acc.push(moduleData);
                    }
                    return acc;
                }, []);
                const result = Object.assign({}, state, {
                    moduleList: newModuleList,
                });
                return result;
            }
        default:
            return state;
    }
};