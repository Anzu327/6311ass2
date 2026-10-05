import {it,expect} from 'vitest';
import {coverPoint} from './faceGeometry';
it('maps face points into cropped and mirrored camera preview',()=>{expect(coverPoint({x:.5,y:.5},640,480,390,844)).toEqual({x:195,y:422});const p=coverPoint({x:.6,y:.5},640,480,390,844);expect(p.x).toBeLessThan(195);expect(coverPoint({x:.6,y:.5},640,480,390,844,false).x).toBeGreaterThan(195);});
