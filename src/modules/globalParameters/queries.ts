import { mockService } from '#core/mockService'
import { GlobalParameter } from '#utils/constants'

const GlobalParameterExportsEnabled = 'SAM.EXPORTS.ENABLED'
const GlobalParameterSamEnabled = 'SAM.ENABLED'

function getValueByKey(key: GlobalParameter): string {
  switch (key) {
    case GlobalParameter.ExportsEnabled:
      return GlobalParameterExportsEnabled
    case GlobalParameter.SamEnabled:
      return GlobalParameterSamEnabled
  }
}

async function isGlobalParameterEnabled(key: GlobalParameter): Promise<boolean> {
  const globalParameter = await mockService.getGlobalParameter(getValueByKey(key))
  return globalParameter?.value?.toLowerCase() === 'true'
}

const updateGlobalParameter = async (key: GlobalParameter, isEnabled: boolean) => {
  return mockService.updateGlobalParameter(getValueByKey(key), isEnabled.toString())
}

export { isGlobalParameterEnabled, updateGlobalParameter }