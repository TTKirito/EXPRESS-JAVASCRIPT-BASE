import { TOKEN_SALE_TYPE } from '../../models/schema/project.model';
import { SORT_TYPE } from '../../utils/constants'
import { Response } from '../schema/project.schema'

  const internalServerError = {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Internal Server Error',
            },
          },
        },
      },
    },
  };
  
  const projectNotFound = {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {type: 'boolean', example: false},
            error: {type: 'object', properties: {
              code: {type: 'string', example: 'PROJECT_NOT_FOUND'}
            }}
          },
        },
      },
    },
  };

  const security = [
    {
      bearerAuth: [],
    },
  ];

  
  const getProjects = {
    tags: ['Projects'],
    description: 'Retrieve all the Projects',
    operationId: 'getProjects',
    security,
    parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            example: 1,
          }
        },
        {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              example: 10,
            }
        },
        {
            name: 'sort',
            in: 'query',  
            schema: {
              type: 'string',
              enum: Object.values(SORT_TYPE),
              example: SORT_TYPE.END_TIME_ASC,            
            } 
          },
        {
          name: 'live',
          in: 'query',  
          schema: {
            type: 'string',
            enum: Object.values(TOKEN_SALE_TYPE),
            example: TOKEN_SALE_TYPE.UPCOMING,            
          } 
        },
        {
          name: 'get_my_project',
          in: 'query',  
          schema: {
            type: 'boolean',
            example: false
          } 
        },
        {
          name: 'get_featured_project',
          in: 'query',  
          schema: {
            type: 'boolean',
            example: false         
          } 
        },
        {
          name: 'token_contract_address',
          in: 'query',  
          schema: {
            type: 'string',
            example: '0x20944b.....',            
          } 
        },
      ],
    responses: {
      '200': {
        description: 'Events retrieved successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: Response,
              },
            },
          },
        },
      },
      '500': internalServerError,
    },
  };

  const followProject = {
    tags: ['Projects'],
    description: 'Follow Project',
    operationId: 'followProject',
    security,
    parameters: [
        {
          name: 'id',
          in: 'path',
          schema: {
            type: 'integer',
            description: 'Project_id',
            example: 1,
            required: true,
          }
        },
      ],
    responses: {
      '200': {
        description: 'Follow project successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolen', example: true},
                result: {type: 'boolen', example: null}
              },
            },
          },
        },
      },
      '500': internalServerError,
      '404': projectNotFound,
    },
  };

  const understandProject = {
    tags: ['Projects'],
    description: 'Understand Project',
    operationId: 'Understand Project',
    security,
    parameters: [
        {
          name: 'id',
          in: 'path',
          schema: {
            type: 'integer',
            description: 'Project_id',
            example: 1,
            required: true,
          }
        },
      ],
    responses: {
      '200': {
        description: 'Understand project successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolen', example: true},
                result: {type: 'boolen', example: null}
              },
            },
          },
        },
      },
      '500': internalServerError,
      '404': projectNotFound,
    },
  };

  const updateProjectInfo = {
    tags: ['Projects'],
    description: 'Update Project info',
    operationId: 'Update Project info',
    security,
    parameters: [
        {
          name: 'id',
          in: 'path',
          schema: {
            type: 'integer',
            description: 'Project_id',
            example: 1,
            required: true,
          }
        },
      ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/updateProjectInfoBody',
          },
        },
      },
        required: true,
      },
    responses: {
      '200': {
        description: 'Update project successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolen', example: true},
                result: {type: 'boolen', example: null}
              },
            },
          },
        },
      },
      '500': internalServerError,
      '404': projectNotFound,
    },
  };
  
  const updateProjectPitch = {
    tags: ['Projects'],
    description: 'Update Project pitch',
    operationId: 'Update Project pitch',
    security,
    parameters: [
        {
          name: 'id',
          in: 'path',
          schema: {
            type: 'integer',
            description: 'Project_id',
            example: 1,
            required: true,
          }
        },
      ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/updateProjectPitchBody',
          },
        },
      },
        required: true,
      },
    responses: {
      '200': {
        description: 'Update project successfully!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolen', example: true},
                result: {type: 'boolen', example: null}
              },
            },
          },
        },
      },
      '500': internalServerError,
      '404': projectNotFound,
    },
  };
  
 
  
  
  export { getProjects, followProject, understandProject, updateProjectInfo, updateProjectPitch };