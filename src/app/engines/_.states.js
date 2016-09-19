export default function states($stateProvider) {
  'ngInject';
  $stateProvider
    .state({
      name: 'engines',
      url: '/engines',
      component: 'engines',
      data: {requiresAuth: true}
    });
}
