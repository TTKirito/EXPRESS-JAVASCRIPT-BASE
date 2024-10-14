import { getProjects, followProject, understandProject, updateProjectInfo, updateProjectPitch } from "./routes/project.routes";
import { getMyToken, createToken, generateTokenData, getTokenDetailByAddress, getApproveTokenData, getUSDTBalance, settingTokenMetrics, confirmSettingTokenMetrics, getTokenMetricsInfo, getClaimData } from "./routes/token.routes";
import { updateProjectInfoBody, updateProjectPitchBody } from "./schema/project.schema"
import { generateTokenBody, createTokenBody, getApproveTokenBody, confirmSettingTokenMetricsBody } from "./schema/token.schema"

const api = (port) => ({
  openapi: '3.0.3',
  info: {
    version: '1.3.0',
    title: 'DAOLaunch - Documentation',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: `http://localhost:${port}/`,
      description: 'Local Server',
    },
    {
      description: 'Dev Server'
    }
  ],
  tags: [
    {
      name: 'Projects',
    },
    {
      name: 'Tokens',
    }
  ],
  paths: {
    '/user/project': {
      get: getProjects,
    },
    '/user/project/{id}': {
      put: updateProjectInfo
    },
    '/user/project/{id}/pitch': {
      put: updateProjectPitch
    },
    '/user/project/{id}/follow': {
      post: followProject
    },
    '/user/project/{id}/understand': {
      post: understandProject
    },
    '/user/token/': {
      get: getMyToken
    },
    '/user/token': {
      post: createToken
    },
    '/user/token/token-data': {
      post: generateTokenData
    },
    '/user/token/{address}': {
      get: getTokenDetailByAddress
    },
    '/user/token/approve/data': {
      post: getApproveTokenData
    },
    '/user/token/balance/usdt': {
      get: getUSDTBalance
    },
    '/user/token/{id}/token-metrics/confirm': {
      post: confirmSettingTokenMetrics
    },
    '/user/token/{id}/token-metrics/submit': {
      post: settingTokenMetrics
    },
    '/user/token/{id}/token-metrics': {
      get: getTokenMetricsInfo
    },
    '/user/token/{id}/token-metrics/claim': {
      post: getClaimData
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      updateProjectInfoBody,
      updateProjectPitchBody,
      generateTokenBody,
      createTokenBody,
      getApproveTokenBody,
      confirmSettingTokenMetricsBody
    },
  },
});

export { api };

