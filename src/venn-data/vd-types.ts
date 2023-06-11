import ExtSet from "../ext-set";
import useVennData from "./venn-data";

declare global {
   namespace Venn {
      type VennDataControl = ReturnType<typeof useVennData>
      type InputItem = string[];
      type InputDetailedItem = { sets: string[], value?: string| number }

      type AreaList = string[];
      type AreaListSet = ExtSet<string>;
      type AreaItem = {
         key: string,
         label: string,
         description: string,
         sets: ExtSet<string>;
         value: string | number;
      };
      type Areas = Set<AreaItem>;

      /** String set of selected areas. */
      type SelectedAreas = ExtSet<string>

      type SetDataItem = {
         key: string;
         label: string,
         areas?: ExtSet<string>;
      };
      type SetDataSets = Set<SetDataItem>;
   }
}
