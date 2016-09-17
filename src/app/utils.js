import angular from 'angular';

export function pluralOrSingular(a) {
  if (angular.isArray(a)) {
    return a.length === 1 ? '' : 's';
  } else {
    // assume it's a number
    return a === 1 ? '' : 's';
  }
}
