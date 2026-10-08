export function formatCount(count:number):string{
 return count>=10000?`${Math.round(count/1000)/10}万`:String(count);
}
