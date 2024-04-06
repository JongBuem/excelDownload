export class DeleteID {
  constructor(arry) {
    this.arry = arry?.length > 0 ? arry : [[]];
  }

  getArray() {
    return this.arry?.map((o) => {
      const noneid = o?.map((v) => {
        const obj = { ...v };
        delete obj?.id;
        return obj;
      });
      return noneid;
    });
  }
}

export class ExcelData extends DeleteID {
  getHeader() {
    return this.arry.map((v) => {
      if (v == undefined) return [];
      else if (v[0] == undefined) return [];
      else {
        return Object.keys(v[0])?.map((o) => {
          return o;
        });
      }
    });
  }
  getData(checkBox) {
    return super.getArray().map((v, i) => {
      if (v?.length > 0) {
        //New Objects Array
        return v?.map((o) => {
          let obj = {};
          const key = Object.keys(o);
          const value = Object.values(o);

          //Location of field to delete
          const renewalNumber = key
            .map((prev, prevIndex) => {
              if (!checkBox[i]?.includes(prev)) return prevIndex;
            })
            .filter((prev) => prev != undefined);

          //Deleted Fields
          const renewalKeys = key
            .map((prev, prevIndex) => {
              if (!renewalNumber?.includes(prevIndex)) return prev;
            })
            .filter((prev) => prev != undefined);

          //Deleted Value
          const renewalValues = value
            .map((prev, prevIndex) => {
              if (!renewalNumber?.includes(prevIndex)) return prev;
            })
            .filter((prev) => prev != undefined);

          //Reconfiguring Objects
          renewalKeys.forEach((prev, prevIndex) => {
            obj[prev] = renewalValues[prevIndex];
          });
          return obj;
        });
      } else return [];
    });
  }
}
