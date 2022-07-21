/* tslint:disable: no-var-requires */
const utils = require('moleculer').Utils;
/* tslint:enable: no-var-requires */
import { GenericObject } from 'moleculer';

function conform<T = GenericObject>(
  args: GenericObject,
  schema: {
    [index: string]: { name: string; type: string } | string;
  },
) {
  const keys = Object.keys(schema);
  const result: T = Object.keys(args)
    .filter(key => keys.includes(key))
    .map(
      key =>
        // tslint:disable-next-line: no-object-literal-type-assertion
        <GenericObject>{
          key:
            typeof schema[key] === 'string'
              ? schema[key]
              : (<any>schema[key]).name,
          type:
            typeof schema[key] === 'string'
              ? 'string'
              : (<any>schema[key]).type,
          value: args[key],
        },
    )
    .reduce((acc, item) => {
      if (typeof item.value === 'string') {
        let value: any;
        const v: string = item.value.toLowerCase().trim();
        if (item.type === 'boolean') {
          value = v === '1' || v === 'true' || v === 'yes' ? true : false;
        }
        else if (item.type === 'number') value = parseInt(v, 10);
        else if (item.type === 'object') value = JSON.parse(item.value);
        else value = item.value;

        if (item.key.split('.').length > 1) utils.dotSet(acc, item.key, value);
        else acc[item.key] = value;
      } else acc[item.key] = item.value;

      return acc;
    }, {}) as T;

  return result;
}

export { conform };
