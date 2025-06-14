
import { constructionWorkers } from './workers/constructionWorkers';
import { deliveryWorkers } from './workers/deliveryWorkers';
import { cleaningWorkers, securityWorkers } from './workers/serviceWorkers';
import { driverWorkers, cookingWorkers, gardeningWorkers, beautyWorkers } from './workers/specialtyWorkers';

export const workersDb = [
  ...constructionWorkers,
  ...deliveryWorkers,
  ...cleaningWorkers,
  ...securityWorkers,
  ...driverWorkers,
  ...cookingWorkers,
  ...gardeningWorkers,
  ...beautyWorkers
];
