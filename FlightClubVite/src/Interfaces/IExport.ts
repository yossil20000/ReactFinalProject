export interface IExportExelTable {
  file: string;
  sheet: string;
  title: string;
  header: string[];
  body: Array<string[]>
  save:boolean;
  showSelfSave?:boolean
}