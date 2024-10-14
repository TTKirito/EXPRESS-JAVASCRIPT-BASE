import { handleExceptionResponse } from '../../utils/system';
import { projectService } from '../../services/project.service';
import {
  authenticated,
  isProjectExisted,
  isValidNetworkId
} from '../../middlewares/policies';

import createProjectDraftValidator from '../../validations/projects/createProjectDraftValidator';
import updateProjectInfoValidator from '../../validations/projects/updateProjectInfoValidator';
import updateProjectPitchValidator from '../../validations/projects/updateProjectPitchValidator';

const ProjectController = require('express').Router();

ProjectController.base = 'project';

/**
 * @description create new project
 */
ProjectController.post('/', [
  authenticated(),
  isValidNetworkId(),
  // createProjectValidator,
], async (req, res) => {
  try {
    const result = await projectService.createProject(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_CREATE_PROJECT_API', error);
  }
});

/**
 * @description Get list projects
 */
ProjectController.get('/', [
  authenticated(false),
], async (req, res) => {
  try {
    const result = await projectService.getListProject(req.body, req.query);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_LIST_PROJECT_API', error);
  }
});

/**
 * @description Get project by id
 */
ProjectController.get('/:id(\\d+)', [
  authenticated()
], async (req, res) => {
  try {
    const result = await projectService.getProjectById(req.params, req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_PROJECT_BY_ID_API', error);
  }
});

/**
 * @description Save transaction history
 */
ProjectController.post('/save-transaction', [
  authenticated(),
  isProjectExisted(),
], async (req, res) => {
  try {
    const result = await projectService.saveTransaction(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_SAVE_TRANSACTION_API', error);
  }
});

/**
 * @description Get participated project list
 */
ProjectController.get('/participated/list', [
  authenticated(),
], async (req, res) => {
  try {
    const result = await projectService.getParticipatedProjectList(req.body, req.query);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_PARTICIPATED_PROJECT_API', error);
  }
});

/**
 * @description Get statistic (total funding, participants, success percentage,...)
 */
ProjectController.get('/statistic', [
  authenticated(),
], async (req, res) => {
  try {
    const result = await projectService.getStatistic(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_STATISTIC_PROJECTS_API', error);
  }
});

/**
 * @description Create or update project draft
 */
ProjectController.post('/draft', [
  authenticated(),
  createProjectDraftValidator,
], async (req, res) => {
  try {
    const result = await projectService.createOrUpdateProjectDraft(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_CREATE_OR_UPDATE_PROJECT_DRAFT_API', error);
  }
});

/**
 * @description Get project draft
 */
ProjectController.get('/draft', [
  authenticated(),
], async (req, res) => {
  try {
    const result = await projectService.getProjectDraft(req.body, req.query);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_PROJECT_DRAFT_API', error);
  }
});

/**
 * @description Get project draft
 */
ProjectController.delete('/draft', [
  authenticated(),
], async (req, res) => {
  try {
    const result = await projectService.clearProjectDraft(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_CLEAR_PROJECT_DRAFT_API', error);
  }
});

/**
 * @description Understand project
 */
ProjectController.post('/understand', [
  authenticated(),
], async (req, res) => {
  try {
    const result = await projectService.understandProject(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_UNDERSTAND_PROJECT_API', error);
  }
});

/**
 * @description Follow project
 */
 ProjectController.post('/:id(\\d+)/follow', [
  authenticated(),
], async (req, res) => {
  try {
    const { id } = req.params
    const { wallet_id } = req.body.wallet
    const result = await projectService.followProject(id, wallet_id);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_FOLLOW_API', error);
  }
});

ProjectController.post('/:id(\\d+)/understand', [
  authenticated(),
], async (req, res) => {
  try {
    const { id } = req.params
    const { wallet_id } = req.body.wallet
    const result = await projectService.understandProjectByProjectId(id, wallet_id);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_UNDERSTAND_PROJECT_API', error);
  }
});

/**
 * @description Update project info
 */
ProjectController.put('/:id(\\d+)', [
  authenticated(),
  updateProjectInfoValidator
], async (req, res) => {
  try {
    const { id } = req.params
    const { wallet_id } = req.body.wallet
    const { body } = req
    delete body.wallet
    const result = await projectService.updateProjectInfo(id, wallet_id, body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_UPDATE_PROJECT_INFO_API', error);
  }
});

/**
 * @description Update project pitch
 */
ProjectController.put('/:id(\\d+)/pitch', [
  authenticated(),
  updateProjectPitchValidator
], async (req, res) => {
  try {
    const { id } = req.params
    const { wallet_id } = req.body.wallet
    const { body } = req
    delete body.wallet
    const result = await projectService.updateProjectPitch(id, wallet_id, body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_UPDATE_PROJECT_PITCH_API', error);
  }
});

export { ProjectController }
