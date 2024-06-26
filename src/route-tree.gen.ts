/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './app/__root'
import { Route as publicIndexImport } from './app/(public)/index'
import { Route as preferencesLayoutImport } from './app/(preferences)/_layout'
import { Route as featuresLayoutImport } from './app/(features)/_layout'
import { Route as authLoginIndexImport } from './app/(auth)/login/index'
import { Route as featuresLayoutDashboardIndexImport } from './app/(features)/_layout.dashboard/index'

// Create Virtual Routes

const preferencesImport = createFileRoute('/(preferences)')()
const featuresImport = createFileRoute('/(features)')()
const preferencesLayoutProfileIndexLazyImport = createFileRoute(
  '/(preferences)/_layout/profile/',
)()
const preferencesLayoutKeybindingsIndexLazyImport = createFileRoute(
  '/(preferences)/_layout/keybindings/',
)()
const preferencesLayoutAppearanceSettingsIndexLazyImport = createFileRoute(
  '/(preferences)/_layout/appearance-settings/',
)()
const preferencesLayoutAccountIndexLazyImport = createFileRoute(
  '/(preferences)/_layout/account/',
)()
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
const featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyImport =
  createFileRoute(
    '/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/',
  )()

// Create/Update Routes

const preferencesRoute = preferencesImport.update({
  id: '/(preferences)',
  getParentRoute: () => rootRoute,
} as any)

const featuresRoute = featuresImport.update({
  id: '/(features)',
  getParentRoute: () => rootRoute,
} as any)

const publicIndexRoute = publicIndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const preferencesLayoutRoute = preferencesLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => preferencesRoute,
} as any)

const featuresLayoutRoute = featuresLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => featuresRoute,
} as any)

const authLoginIndexRoute = authLoginIndexImport.update({
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const preferencesLayoutProfileIndexLazyRoute =
  preferencesLayoutProfileIndexLazyImport
    .update({
      path: '/profile/',
      getParentRoute: () => preferencesLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(preferences)/_layout.profile/index.lazy').then(
        (d) => d.Route,
      ),
    )

const preferencesLayoutKeybindingsIndexLazyRoute =
  preferencesLayoutKeybindingsIndexLazyImport
    .update({
      path: '/keybindings/',
      getParentRoute: () => preferencesLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(preferences)/_layout.keybindings/index.lazy').then(
        (d) => d.Route,
      ),
    )

const preferencesLayoutAppearanceSettingsIndexLazyRoute =
  preferencesLayoutAppearanceSettingsIndexLazyImport
    .update({
      path: '/appearance-settings/',
      getParentRoute: () => preferencesLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(preferences)/_layout.appearance-settings/index.lazy').then(
        (d) => d.Route,
      ),
    )

const preferencesLayoutAccountIndexLazyRoute =
  preferencesLayoutAccountIndexLazyImport
    .update({
      path: '/account/',
      getParentRoute: () => preferencesLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(preferences)/_layout.account/index.lazy').then(
        (d) => d.Route,
      ),
    )

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
    '/(preferences)': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof preferencesImport
      parentRoute: typeof rootRoute
    }
    '/(preferences)/_layout': {
      id: '/_layout'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof preferencesLayoutImport
      parentRoute: typeof preferencesRoute
    }
    '/(public)/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof publicIndexImport
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
    '/(preferences)/_layout/account/': {
      id: '/_layout/account/'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof preferencesLayoutAccountIndexLazyImport
      parentRoute: typeof preferencesLayoutImport
    }
    '/(preferences)/_layout/appearance-settings/': {
      id: '/_layout/appearance-settings/'
      path: '/appearance-settings'
      fullPath: '/appearance-settings'
      preLoaderRoute: typeof preferencesLayoutAppearanceSettingsIndexLazyImport
      parentRoute: typeof preferencesLayoutImport
    }
    '/(preferences)/_layout/keybindings/': {
      id: '/_layout/keybindings/'
      path: '/keybindings'
      fullPath: '/keybindings'
      preLoaderRoute: typeof preferencesLayoutKeybindingsIndexLazyImport
      parentRoute: typeof preferencesLayoutImport
    }
    '/(preferences)/_layout/profile/': {
      id: '/_layout/profile/'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof preferencesLayoutProfileIndexLazyImport
      parentRoute: typeof preferencesLayoutImport
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
  }),
  preferencesRoute: preferencesRoute.addChildren({
    preferencesLayoutRoute: preferencesLayoutRoute.addChildren({
      preferencesLayoutAccountIndexLazyRoute,
      preferencesLayoutAppearanceSettingsIndexLazyRoute,
      preferencesLayoutKeybindingsIndexLazyRoute,
      preferencesLayoutProfileIndexLazyRoute,
    }),
  }),
  publicIndexRoute,
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
        "/",
        "/login/"
      ]
    },
    "/": {
      "filePath": "(public)/index.tsx"
    },
    "/_layout": {
      "filePath": "(preferences)/_layout.tsx",
      "parent": "/",
      "children": [
        "/_layout/account/",
        "/_layout/appearance-settings/",
        "/_layout/keybindings/",
        "/_layout/profile/"
      ]
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
    "/_layout/account/": {
      "filePath": "(preferences)/_layout.account/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/appearance-settings/": {
      "filePath": "(preferences)/_layout.appearance-settings/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/keybindings/": {
      "filePath": "(preferences)/_layout.keybindings/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/profile/": {
      "filePath": "(preferences)/_layout.profile/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/warehouse/_layout/storage-details/$warehouseNum/": {
      "filePath": "(features)/_layout.warehouse/_layout.storage-details.$warehouseNum/index.lazy.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
