import cloneDeep from 'lodash.clonedeep'
import traverse from 'traverse'

const MASKING_STRING = '********'
const SENSITIVE_PROPS = ['password', 'authorization', 'auth-token']

/**
 * Mask all properties defined by {@see SENSITIVE_PROPS} in the given {@see data} object
 * with the mask string defined by {@see MASKING_STRING}.
 */
export function maskSensitiveData(data: unknown) {
  if (typeof data === 'object') {
    const mutatedData = cloneDeep(data)
    traverse(mutatedData).forEach(function () {
      if (SENSITIVE_PROPS.includes(this.key?.toLowerCase() ?? '')) {
        this.update(MASKING_STRING)
      }
    })
    return mutatedData
  }
  return data
}
