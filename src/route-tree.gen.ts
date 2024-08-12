/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './app/__root'
import { Route as publicIndexImport } from './app/(public)/index'
import { Route as featuresLayoutImport } from './app/(features)/_layout'
import { Route as authLoginIndexImport } from './app/(auth)/login/index'
import { Route as authAuthorizationIndexImport } from './app/(auth)/authorization/index'
import { Route as featuresPreferencesLayoutImport } from './app/(features)/preferences/_layout'
import { Route as featuresLayoutDashboardIndexImport } from './app/(features)/_layout.dashboard/index'

// Create Virtual Routes

const featuresImport = createFileRoute('/(features)')()
const featuresPreferencesImport = createFileRoute('/(features)/preferences')()
const featuresLayoutWarehouseIndexLazyImport = createFileRoute(
  '/(features)/_layout/warehouse/',
)()
const featuresLayoutWarehouseImportIndexLazyImport = createFileRoute(
  '/(features)/_layout/warehouse-import/',
)()
const featuresLayoutWarehouseExportIndexLazyImport = createFileRoute(
  '/(features)/_layout/warehouse-export/',
)()
const featuresLayoutTransferManagementIndexLazyImport = createFileRoute(
  '/(features)/_layout/transfer-management/',
)()
const featuresLayoutReportIndexLazyImport = createFileRoute(
  '/(features)/_layout/report/',
)()
const featuresLayoutProductIncomingInspectionIndexLazyImport = createFileRoute(
  '/(features)/_layout/product-incoming-inspection/',
)()
const featuresLayoutInventoryIndexLazyImport = createFileRoute(
  '/(features)/_layout/inventory/',
)()
const featuresLayoutInoutboundIndexLazyImport = createFileRoute(
  '/(features)/_layout/inoutbound/',
)()
const featuresPreferencesLayoutProfileIndexLazyImport = createFileRoute(
  '/(features)/preferences/_layout/profile/',
)()
const featuresPreferencesLayoutKeybindingsIndexLazyImport = createFileRoute(
  '/(features)/preferences/_layout/keybindings/',
)()
const featuresPreferencesLayoutAppearanceSettingsIndexLazyImport =
  createFileRoute('/(features)/preferences/_layout/appearance-settings/')()
const featuresPreferencesLayoutAccountIndexLazyImport = createFileRoute(
  '/(features)/preferences/_layout/account/',
)()
const featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyImport =
  createFileRoute(
    '/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/',
  )()

// Create/Update Routes

const featuresRoute = featuresImport.update({
  id: '/(features)',
  getParentRoute: () => rootRoute,
} as any)

const featuresPreferencesRoute = featuresPreferencesImport.update({
  path: '/preferences',
  getParentRoute: () => featuresRoute,
} as any)

const publicIndexRoute = publicIndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const featuresLayoutRoute = featuresLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => featuresRoute,
} as any)

const authLoginIndexRoute = authLoginIndexImport.update({
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const authAuthorizationIndexRoute = authAuthorizationIndexImport.update({
  path: '/authorization/',
  getParentRoute: () => rootRoute,
} as any)

const featuresPreferencesLayoutRoute = featuresPreferencesLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => featuresPreferencesRoute,
} as any)

const featuresLayoutWarehouseIndexLazyRoute =
  featuresLayoutWarehouseIndexLazyImport
    .update({
      path: '/warehouse/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(features)/_layout.warehouse/index.lazy').then(
        (d) => d.Route,
      ),
    )

const featuresLayoutWarehouseImportIndexLazyRoute =
  featuresLayoutWarehouseImportIndexLazyImport
    .update({
      path: '/warehouse-import/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(features)/_layout.warehouse-import/index.lazy').then(
        (d) => d.Route,
      ),
    )

const featuresLayoutWarehouseExportIndexLazyRoute =
  featuresLayoutWarehouseExportIndexLazyImport
    .update({
      path: '/warehouse-export/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(features)/_layout.warehouse-export/index.lazy').then(
        (d) => d.Route,
      ),
    )

const featuresLayoutTransferManagementIndexLazyRoute =
  featuresLayoutTransferManagementIndexLazyImport
    .update({
      path: '/transfer-management/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(features)/_layout.transfer-management/index.lazy').then(
        (d) => d.Route,
      ),
    )

const featuresLayoutReportIndexLazyRoute = featuresLayoutReportIndexLazyImport
  .update({
    path: '/report/',
    getParentRoute: () => featuresLayoutRoute,
  } as any)
  .lazy(() =>
    import('./app/(features)/_layout.report/index.lazy').then((d) => d.Route),
  )

const featuresLayoutProductIncomingInspectionIndexLazyRoute =
  featuresLayoutProductIncomingInspectionIndexLazyImport
    .update({
      path: '/product-incoming-inspection/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import(
        './app/(features)/_layout.product-incoming-inspection/index.lazy'
      ).then((d) => d.Route),
    )

const featuresLayoutInventoryIndexLazyRoute =
  featuresLayoutInventoryIndexLazyImport
    .update({
      path: '/inventory/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(features)/_layout.inventory/index.lazy').then(
        (d) => d.Route,
      ),
    )

const featuresLayoutInoutboundIndexLazyRoute =
  featuresLayoutInoutboundIndexLazyImport
    .update({
      path: '/inoutbound/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(features)/_layout.inoutbound/index.lazy').then(
        (d) => d.Route,
      ),
    )

const featuresLayoutDashboardIndexRoute =
  featuresLayoutDashboardIndexImport.update({
    path: '/dashboard/',
    getParentRoute: () => featuresLayoutRoute,
  } as any)

const featuresPreferencesLayoutProfileIndexLazyRoute =
  featuresPreferencesLayoutProfileIndexLazyImport
    .update({
      path: '/profile/',
      getParentRoute: () => featuresPreferencesLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(features)/preferences/_layout.profile/index.lazy').then(
        (d) => d.Route,
      ),
    )

const featuresPreferencesLayoutKeybindingsIndexLazyRoute =
  featuresPreferencesLayoutKeybindingsIndexLazyImport
    .update({
      path: '/keybindings/',
      getParentRoute: () => featuresPreferencesLayoutRoute,
    } as any)
    .lazy(() =>
      import(
        './app/(features)/preferences/_layout.keybindings/index.lazy'
      ).then((d) => d.Route),
    )

const featuresPreferencesLayoutAppearanceSettingsIndexLazyRoute =
  featuresPreferencesLayoutAppearanceSettingsIndexLazyImport
    .update({
      path: '/appearance-settings/',
      getParentRoute: () => featuresPreferencesLayoutRoute,
    } as any)
    .lazy(() =>
      import(
        './app/(features)/preferences/_layout.appearance-settings/index.lazy'
      ).then((d) => d.Route),
    )

const featuresPreferencesLayoutAccountIndexLazyRoute =
  featuresPreferencesLayoutAccountIndexLazyImport
    .update({
      path: '/account/',
      getParentRoute: () => featuresPreferencesLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(features)/preferences/_layout.account/index.lazy').then(
        (d) => d.Route,
      ),
    )

const featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyRoute =
  featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyImport
    .update({
      path: '/warehouse/storage-details/$warehouseNum/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import(
        './app/(features)/_layout.warehouse/_layout.storage-details.$warehouseNum/index.lazy'
      ).then((d) => d.Route),
    )

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/(features)': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof featuresImport
      parentRoute: typeof rootRoute
    }
    '/(features)/_layout': {
      id: '/_layout'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof featuresLayoutImport
      parentRoute: typeof featuresRoute
    }
    '/(public)/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof publicIndexImport
      parentRoute: typeof rootRoute
    }
    '/(features)/preferences': {
      id: '/preferences'
      path: '/preferences'
      fullPath: '/preferences'
      preLoaderRoute: typeof featuresPreferencesImport
      parentRoute: typeof featuresImport
    }
    '/(features)/preferences/_layout': {
      id: '/preferences/_layout'
      path: '/preferences'
      fullPath: '/preferences'
      preLoaderRoute: typeof featuresPreferencesLayoutImport
      parentRoute: typeof featuresPreferencesRoute
    }
    '/(auth)/authorization/': {
      id: '/authorization/'
      path: '/authorization'
      fullPath: '/authorization'
      preLoaderRoute: typeof authAuthorizationIndexImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/login/': {
      id: '/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/(features)/_layout/dashboard/': {
      id: '/_layout/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof featuresLayoutDashboardIndexImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/inoutbound/': {
      id: '/_layout/inoutbound/'
      path: '/inoutbound'
      fullPath: '/inoutbound'
      preLoaderRoute: typeof featuresLayoutInoutboundIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/inventory/': {
      id: '/_layout/inventory/'
      path: '/inventory'
      fullPath: '/inventory'
      preLoaderRoute: typeof featuresLayoutInventoryIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/product-incoming-inspection/': {
      id: '/_layout/product-incoming-inspection/'
      path: '/product-incoming-inspection'
      fullPath: '/product-incoming-inspection'
      preLoaderRoute: typeof featuresLayoutProductIncomingInspectionIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/report/': {
      id: '/_layout/report/'
      path: '/report'
      fullPath: '/report'
      preLoaderRoute: typeof featuresLayoutReportIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/transfer-management/': {
      id: '/_layout/transfer-management/'
      path: '/transfer-management'
      fullPath: '/transfer-management'
      preLoaderRoute: typeof featuresLayoutTransferManagementIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/warehouse-export/': {
      id: '/_layout/warehouse-export/'
      path: '/warehouse-export'
      fullPath: '/warehouse-export'
      preLoaderRoute: typeof featuresLayoutWarehouseExportIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/warehouse-import/': {
      id: '/_layout/warehouse-import/'
      path: '/warehouse-import'
      fullPath: '/warehouse-import'
      preLoaderRoute: typeof featuresLayoutWarehouseImportIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/warehouse/': {
      id: '/_layout/warehouse/'
      path: '/warehouse'
      fullPath: '/warehouse'
      preLoaderRoute: typeof featuresLayoutWarehouseIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/preferences/_layout/account/': {
      id: '/preferences/_layout/account/'
      path: '/account'
      fullPath: '/preferences/account'
      preLoaderRoute: typeof featuresPreferencesLayoutAccountIndexLazyImport
      parentRoute: typeof featuresPreferencesLayoutImport
    }
    '/(features)/preferences/_layout/appearance-settings/': {
      id: '/preferences/_layout/appearance-settings/'
      path: '/appearance-settings'
      fullPath: '/preferences/appearance-settings'
      preLoaderRoute: typeof featuresPreferencesLayoutAppearanceSettingsIndexLazyImport
      parentRoute: typeof featuresPreferencesLayoutImport
    }
    '/(features)/preferences/_layout/keybindings/': {
      id: '/preferences/_layout/keybindings/'
      path: '/keybindings'
      fullPath: '/preferences/keybindings'
      preLoaderRoute: typeof featuresPreferencesLayoutKeybindingsIndexLazyImport
      parentRoute: typeof featuresPreferencesLayoutImport
    }
    '/(features)/preferences/_layout/profile/': {
      id: '/preferences/_layout/profile/'
      path: '/profile'
      fullPath: '/preferences/profile'
      preLoaderRoute: typeof featuresPreferencesLayoutProfileIndexLazyImport
      parentRoute: typeof featuresPreferencesLayoutImport
    }
    '/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/': {
      id: '/_layout/warehouse/_layout/storage-details/$warehouseNum/'
      path: '/warehouse/storage-details/$warehouseNum'
      fullPath: '/warehouse/storage-details/$warehouseNum'
      preLoaderRoute: typeof featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  featuresRoute: featuresRoute.addChildren({
    featuresLayoutRoute: featuresLayoutRoute.addChildren({
      featuresLayoutDashboardIndexRoute,
      featuresLayoutInoutboundIndexLazyRoute,
      featuresLayoutInventoryIndexLazyRoute,
      featuresLayoutProductIncomingInspectionIndexLazyRoute,
      featuresLayoutReportIndexLazyRoute,
      featuresLayoutTransferManagementIndexLazyRoute,
      featuresLayoutWarehouseExportIndexLazyRoute,
      featuresLayoutWarehouseImportIndexLazyRoute,
      featuresLayoutWarehouseIndexLazyRoute,
      featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyRoute,
    }),
    featuresPreferencesRoute: featuresPreferencesRoute.addChildren({
      featuresPreferencesLayoutRoute:
        featuresPreferencesLayoutRoute.addChildren({
          featuresPreferencesLayoutAccountIndexLazyRoute,
          featuresPreferencesLayoutAppearanceSettingsIndexLazyRoute,
          featuresPreferencesLayoutKeybindingsIndexLazyRoute,
          featuresPreferencesLayoutProfileIndexLazyRoute,
        }),
    }),
  }),
  publicIndexRoute,
  authAuthorizationIndexRoute,
  authLoginIndexRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/",
        "/authorization/",
        "/login/"
      ]
    },
    "/": {
      "filePath": "(public)/index.tsx"
    },
    "/_layout": {
      "filePath": "(features)/_layout.tsx",
      "parent": "/",
      "children": [
        "/_layout/dashboard/",
        "/_layout/inoutbound/",
        "/_layout/inventory/",
        "/_layout/product-incoming-inspection/",
        "/_layout/report/",
        "/_layout/transfer-management/",
        "/_layout/warehouse-export/",
        "/_layout/warehouse-import/",
        "/_layout/warehouse/",
        "/_layout/warehouse/_layout/storage-details/$warehouseNum/"
      ]
    },
    "/preferences": {
      "filePath": "(features)/preferences",
      "parent": "/",
      "children": [
        "/preferences/_layout"
      ]
    },
    "/preferences/_layout": {
      "filePath": "(features)/preferences/_layout.tsx",
      "parent": "/preferences",
      "children": [
        "/preferences/_layout/account/",
        "/preferences/_layout/appearance-settings/",
        "/preferences/_layout/keybindings/",
        "/preferences/_layout/profile/"
      ]
    },
    "/authorization/": {
      "filePath": "(auth)/authorization/index.tsx"
    },
    "/login/": {
      "filePath": "(auth)/login/index.tsx"
    },
    "/_layout/dashboard/": {
      "filePath": "(features)/_layout.dashboard/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/inoutbound/": {
      "filePath": "(features)/_layout.inoutbound/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/inventory/": {
      "filePath": "(features)/_layout.inventory/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/product-incoming-inspection/": {
      "filePath": "(features)/_layout.product-incoming-inspection/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/report/": {
      "filePath": "(features)/_layout.report/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/transfer-management/": {
      "filePath": "(features)/_layout.transfer-management/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/warehouse-export/": {
      "filePath": "(features)/_layout.warehouse-export/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/warehouse-import/": {
      "filePath": "(features)/_layout.warehouse-import/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/warehouse/": {
      "filePath": "(features)/_layout.warehouse/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/preferences/_layout/account/": {
      "filePath": "(features)/preferences/_layout.account/index.lazy.tsx",
      "parent": "/preferences/_layout"
    },
    "/preferences/_layout/appearance-settings/": {
      "filePath": "(features)/preferences/_layout.appearance-settings/index.lazy.tsx",
      "parent": "/preferences/_layout"
    },
    "/preferences/_layout/keybindings/": {
      "filePath": "(features)/preferences/_layout.keybindings/index.lazy.tsx",
      "parent": "/preferences/_layout"
    },
    "/preferences/_layout/profile/": {
      "filePath": "(features)/preferences/_layout.profile/index.lazy.tsx",
      "parent": "/preferences/_layout"
    },
    "/_layout/warehouse/_layout/storage-details/$warehouseNum/": {
      "filePath": "(features)/_layout.warehouse/_layout.storage-details.$warehouseNum/index.lazy.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
