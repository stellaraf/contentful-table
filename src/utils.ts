/**
 * @documentation https://github.com/contentful/ui-extensions-sdk/blob/master/typings.d.ts
 */
// @ts-ignore
import { FieldAPI, DialogsAPI } from 'contentful-ui-extensions-sdk'

export { DialogsAPI }

export enum Intent {
  Primary = 'primary',
  Positive = 'positive',
  Negative = 'negative',
}

/**
 * Check if window is within an iframe
 *
 * @source https://stackoverflow.com/a/326076/6817437
 */
const inIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

/**
 * Determine whether to use Contentful API or mock for dev and demo
 */
export const useContentfulApi = () => inIframe()

/**
 * Optional table data that may seed the table with populated data -
 * such as when an existing table is accessed
 */
export type TableData = Array<Array<string>>

/**
 * Storage values for the extension's content field
 */
export interface ExtensionValues {
  useColumnHeader: boolean
  useRowHeader: boolean
  tableData: TableData
}

/**
 * Field action prototype to edit the `ExtensionValues`
 * of this extension. Not all values on this object are typed here
 */
export type ExtensionField =
  | FieldAPI
  | {
      getValue: () => any
      setValue: (arg: any) => any
    }

/**
 * Contentful's `window.contentfulExtension` callback arg
 * Not all values on this object are typed here 😞
 */
export interface Extension {
  field: ExtensionField
  dialogs?: DialogsAPI
  /**
   * Add contentful API to window
   *
   * @source https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#window
   */
  window: {
    startAutoResizer: () => void
    updateHeight: () => void
  }
}

/**
 * Seed the tableData with initial data, minimum rows/columns
 * should at least be passed in
 */
export const getInitialTableData = ({
  rows,
  columns,
}: {
  rows: number
  columns: number
}): TableData => Array.from(new Array(rows), () => new Array(columns))

/**
 * Keep a number with the boundaries of a minimum and maximum
 *
 * @param num value to evaluate
 * @param min minimum value boundary
 * @param max maximum value boundary
 * @returns bounded value within a min/max
 */
export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)

/**
 * Pretend prototype for `Extension.field`
 */
class MockExtensionField {
  storageKeyName = 'mockContentfulData'

  private serialize(data: any): string {
    return JSON.stringify(data)
  }

  private deserialize(data: any): any {
    return JSON.parse(data)
  }

  setValue(value: any) {
    localStorage.setItem(this.storageKeyName, this.serialize(value))
    this.onValueChanged()
  }

  getValue() {
    return this.deserialize(localStorage.getItem(this.storageKeyName))
  }

  onValueChanged() {
    return this.getValue()
  }
}

const emptyFunction = () => {}

/**
 * @returns mimic for extension parameter provided by Contentful API
 */
export const createMockExtension = (): Extension => {
  return {
    field: new MockExtensionField(),
    window: {
      updateHeight: emptyFunction,
      startAutoResizer: emptyFunction,
    },
  }
}