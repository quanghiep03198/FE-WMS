/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './app/__root'
import { Route as PubsubImport } from './app/pubsub'
import { Route as publicIndexImport } from './app/(public)/index'
import { Route as featuresLayoutImport } from './app/(features)/_layout'
import { Route as authLoginIndexImport } from './app/(auth)/login/index'
import { Route as authAuthorizationIndexImport } from './app/(auth)/authorization/index'
import { Route as featuresPreferencesLayoutImport } from './app/(features)/preferences/_layout'
import { Route as featuresLayoutProductionManagementInboundIndexImport } from './app/(features)/_layout.production-management-inbound/index'
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
const featuresLayoutFinishedProductionInoutboundIndexLazyImport =
  createFileRoute('/(features)/_layout/finished-production-inoutbound/')()
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

const PubsubRoute = PubsubImport.update({
  id: '/pubsub',
  path: '/pubsub',
  getParentRoute: () => rootRoute,
} as any)

const featuresPreferencesRoute = featuresPreferencesImport.update({
  id: '/preferences',
  path: '/preferences',
  getParentRoute: () => featuresRoute,
} as any)

const publicIndexRoute = publicIndexImport.update({
  id: '/(public)/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const featuresLayoutRoute = featuresLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => featuresRoute,
} as any)

const authLoginIndexRoute = authLoginIndexImport.update({
  id: '/(auth)/login/',
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const authAuthorizationIndexRoute = authAuthorizationIndexImport.update({
  id: '/(auth)/authorization/',
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
      id: '/warehouse/',
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
      id: '/warehouse-import/',
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
      id: '/warehouse-export/',
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
      id: '/transfer-management/',
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
    id: '/report/',
    path: '/report/',
    getParentRoute: () => featuresLayoutRoute,
  } as any)
  .lazy(() =>
    import('./app/(features)/_layout.report/index.lazy').then((d) => d.Route),
  )

const featuresLayoutProductIncomingInspectionIndexLazyRoute =
  featuresLayoutProductIncomingInspectionIndexLazyImport
    .update({
      id: '/product-incoming-inspection/',
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
      id: '/inventory/',
      path: '/inventory/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import('./app/(features)/_layout.inventory/index.lazy').then(
        (d) => d.Route,
      ),
    )

const featuresLayoutFinishedProductionInoutboundIndexLazyRoute =
  featuresLayoutFinishedProductionInoutboundIndexLazyImport
    .update({
      id: '/finished-production-inoutbound/',
      path: '/finished-production-inoutbound/',
      getParentRoute: () => featuresLayoutRoute,
    } as any)
    .lazy(() =>
      import(
        './app/(features)/_layout.finished-production-inoutbound/index.lazy'
      ).then((d) => d.Route),
    )

const featuresLayoutProductionManagementInboundIndexRoute =
  featuresLayoutProductionManagementInboundIndexImport.update({
    id: '/production-management-inbound/',
    path: '/production-management-inbound/',
    getParentRoute: () => featuresLayoutRoute,
  } as any)

const featuresLayoutDashboardIndexRoute =
  featuresLayoutDashboardIndexImport.update({
    id: '/dashboard/',
    path: '/dashboard/',
    getParentRoute: () => featuresLayoutRoute,
  } as any)

const featuresPreferencesLayoutKeybindingsIndexLazyRoute =
  featuresPreferencesLayoutKeybindingsIndexLazyImport
    .update({
      id: '/keybindings/',
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
      id: '/appearance-settings/',
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
      id: '/account/',
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
      id: '/warehouse/_layout/storage-details/$warehouseNum/',
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
    '/pubsub': {
      id: '/pubsub'
      path: '/pubsub'
      fullPath: '/pubsub'
      preLoaderRoute: typeof PubsubImport
      parentRoute: typeof rootRoute
    }
    '/(features)': {
      id: '/(features)'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof featuresImport
      parentRoute: typeof rootRoute
    }
    '/(features)/_layout': {
      id: '/(features)/_layout'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof featuresLayoutImport
      parentRoute: typeof featuresRoute
    }
    '/(public)/': {
      id: '/(public)/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof publicIndexImport
      parentRoute: typeof rootRoute
    }
    '/(features)/preferences': {
      id: '/(features)/preferences'
      path: '/preferences'
      fullPath: '/preferences'
      preLoaderRoute: typeof featuresPreferencesImport
      parentRoute: typeof featuresImport
    }
    '/(features)/preferences/_layout': {
      id: '/(features)/preferences/_layout'
      path: '/preferences'
      fullPath: '/preferences'
      preLoaderRoute: typeof featuresPreferencesLayoutImport
      parentRoute: typeof featuresPreferencesRoute
    }
    '/(auth)/authorization/': {
      id: '/(auth)/authorization/'
      path: '/authorization'
      fullPath: '/authorization'
      preLoaderRoute: typeof authAuthorizationIndexImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/login/': {
      id: '/(auth)/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/(features)/_layout/dashboard/': {
      id: '/(features)/_layout/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof featuresLayoutDashboardIndexImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/production-management-inbound/': {
      id: '/(features)/_layout/production-management-inbound/'
      path: '/production-management-inbound'
      fullPath: '/production-management-inbound'
      preLoaderRoute: typeof featuresLayoutProductionManagementInboundIndexImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/finished-production-inoutbound/': {
      id: '/(features)/_layout/finished-production-inoutbound/'
      path: '/finished-production-inoutbound'
      fullPath: '/finished-production-inoutbound'
      preLoaderRoute: typeof featuresLayoutFinishedProductionInoutboundIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/inventory/': {
      id: '/(features)/_layout/inventory/'
      path: '/inventory'
      fullPath: '/inventory'
      preLoaderRoute: typeof featuresLayoutInventoryIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/product-incoming-inspection/': {
      id: '/(features)/_layout/product-incoming-inspection/'
      path: '/product-incoming-inspection'
      fullPath: '/product-incoming-inspection'
      preLoaderRoute: typeof featuresLayoutProductIncomingInspectionIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/report/': {
      id: '/(features)/_layout/report/'
      path: '/report'
      fullPath: '/report'
      preLoaderRoute: typeof featuresLayoutReportIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/transfer-management/': {
      id: '/(features)/_layout/transfer-management/'
      path: '/transfer-management'
      fullPath: '/transfer-management'
      preLoaderRoute: typeof featuresLayoutTransferManagementIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/warehouse-export/': {
      id: '/(features)/_layout/warehouse-export/'
      path: '/warehouse-export'
      fullPath: '/warehouse-export'
      preLoaderRoute: typeof featuresLayoutWarehouseExportIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/warehouse-import/': {
      id: '/(features)/_layout/warehouse-import/'
      path: '/warehouse-import'
      fullPath: '/warehouse-import'
      preLoaderRoute: typeof featuresLayoutWarehouseImportIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/_layout/warehouse/': {
      id: '/(features)/_layout/warehouse/'
      path: '/warehouse'
      fullPath: '/warehouse'
      preLoaderRoute: typeof featuresLayoutWarehouseIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
    '/(features)/preferences/_layout/account/': {
      id: '/(features)/preferences/_layout/account/'
      path: '/account'
      fullPath: '/preferences/account'
      preLoaderRoute: typeof featuresPreferencesLayoutAccountIndexLazyImport
      parentRoute: typeof featuresPreferencesLayoutImport
    }
    '/(features)/preferences/_layout/appearance-settings/': {
      id: '/(features)/preferences/_layout/appearance-settings/'
      path: '/appearance-settings'
      fullPath: '/preferences/appearance-settings'
      preLoaderRoute: typeof featuresPreferencesLayoutAppearanceSettingsIndexLazyImport
      parentRoute: typeof featuresPreferencesLayoutImport
    }
    '/(features)/preferences/_layout/keybindings/': {
      id: '/(features)/preferences/_layout/keybindings/'
      path: '/keybindings'
      fullPath: '/preferences/keybindings'
      preLoaderRoute: typeof featuresPreferencesLayoutKeybindingsIndexLazyImport
      parentRoute: typeof featuresPreferencesLayoutImport
    }
    '/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/': {
      id: '/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/'
      path: '/warehouse/storage-details/$warehouseNum'
      fullPath: '/warehouse/storage-details/$warehouseNum'
      preLoaderRoute: typeof featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyImport
      parentRoute: typeof featuresLayoutImport
    }
  }
}

// Create and export the route tree

interface featuresLayoutRouteChildren {
  featuresLayoutDashboardIndexRoute: typeof featuresLayoutDashboardIndexRoute
  featuresLayoutProductionManagementInboundIndexRoute: typeof featuresLayoutProductionManagementInboundIndexRoute
  featuresLayoutFinishedProductionInoutboundIndexLazyRoute: typeof featuresLayoutFinishedProductionInoutboundIndexLazyRoute
  featuresLayoutInventoryIndexLazyRoute: typeof featuresLayoutInventoryIndexLazyRoute
  featuresLayoutProductIncomingInspectionIndexLazyRoute: typeof featuresLayoutProductIncomingInspectionIndexLazyRoute
  featuresLayoutReportIndexLazyRoute: typeof featuresLayoutReportIndexLazyRoute
  featuresLayoutTransferManagementIndexLazyRoute: typeof featuresLayoutTransferManagementIndexLazyRoute
  featuresLayoutWarehouseExportIndexLazyRoute: typeof featuresLayoutWarehouseExportIndexLazyRoute
  featuresLayoutWarehouseImportIndexLazyRoute: typeof featuresLayoutWarehouseImportIndexLazyRoute
  featuresLayoutWarehouseIndexLazyRoute: typeof featuresLayoutWarehouseIndexLazyRoute
  featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyRoute: typeof featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyRoute
}

const featuresLayoutRouteChildren: featuresLayoutRouteChildren = {
  featuresLayoutDashboardIndexRoute: featuresLayoutDashboardIndexRoute,
  featuresLayoutProductionManagementInboundIndexRoute:
    featuresLayoutProductionManagementInboundIndexRoute,
  featuresLayoutFinishedProductionInoutboundIndexLazyRoute:
    featuresLayoutFinishedProductionInoutboundIndexLazyRoute,
  featuresLayoutInventoryIndexLazyRoute: featuresLayoutInventoryIndexLazyRoute,
  featuresLayoutProductIncomingInspectionIndexLazyRoute:
    featuresLayoutProductIncomingInspectionIndexLazyRoute,
  featuresLayoutReportIndexLazyRoute: featuresLayoutReportIndexLazyRoute,
  featuresLayoutTransferManagementIndexLazyRoute:
    featuresLayoutTransferManagementIndexLazyRoute,
  featuresLayoutWarehouseExportIndexLazyRoute:
    featuresLayoutWarehouseExportIndexLazyRoute,
  featuresLayoutWarehouseImportIndexLazyRoute:
    featuresLayoutWarehouseImportIndexLazyRoute,
  featuresLayoutWarehouseIndexLazyRoute: featuresLayoutWarehouseIndexLazyRoute,
  featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyRoute:
    featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyRoute,
}

const featuresLayoutRouteWithChildren = featuresLayoutRoute._addFileChildren(
  featuresLayoutRouteChildren,
)

interface featuresPreferencesLayoutRouteChildren {
  featuresPreferencesLayoutAccountIndexLazyRoute: typeof featuresPreferencesLayoutAccountIndexLazyRoute
  featuresPreferencesLayoutAppearanceSettingsIndexLazyRoute: typeof featuresPreferencesLayoutAppearanceSettingsIndexLazyRoute
  featuresPreferencesLayoutKeybindingsIndexLazyRoute: typeof featuresPreferencesLayoutKeybindingsIndexLazyRoute
}

const featuresPreferencesLayoutRouteChildren: featuresPreferencesLayoutRouteChildren =
  {
    featuresPreferencesLayoutAccountIndexLazyRoute:
      featuresPreferencesLayoutAccountIndexLazyRoute,
    featuresPreferencesLayoutAppearanceSettingsIndexLazyRoute:
      featuresPreferencesLayoutAppearanceSettingsIndexLazyRoute,
    featuresPreferencesLayoutKeybindingsIndexLazyRoute:
      featuresPreferencesLayoutKeybindingsIndexLazyRoute,
  }

const featuresPreferencesLayoutRouteWithChildren =
  featuresPreferencesLayoutRoute._addFileChildren(
    featuresPreferencesLayoutRouteChildren,
  )

interface featuresPreferencesRouteChildren {
  featuresPreferencesLayoutRoute: typeof featuresPreferencesLayoutRouteWithChildren
}

const featuresPreferencesRouteChildren: featuresPreferencesRouteChildren = {
  featuresPreferencesLayoutRoute: featuresPreferencesLayoutRouteWithChildren,
}

const featuresPreferencesRouteWithChildren =
  featuresPreferencesRoute._addFileChildren(featuresPreferencesRouteChildren)

interface featuresRouteChildren {
  featuresLayoutRoute: typeof featuresLayoutRouteWithChildren
  featuresPreferencesRoute: typeof featuresPreferencesRouteWithChildren
}

const featuresRouteChildren: featuresRouteChildren = {
  featuresLayoutRoute: featuresLayoutRouteWithChildren,
  featuresPreferencesRoute: featuresPreferencesRouteWithChildren,
}

const featuresRouteWithChildren = featuresRoute._addFileChildren(
  featuresRouteChildren,
)

export interface FileRoutesByFullPath {
  '/pubsub': typeof PubsubRoute
  '/': typeof publicIndexRoute
  '/preferences': typeof featuresPreferencesLayoutRouteWithChildren
  '/authorization': typeof authAuthorizationIndexRoute
  '/login': typeof authLoginIndexRoute
  '/dashboard': typeof featuresLayoutDashboardIndexRoute
  '/production-management-inbound': typeof featuresLayoutProductionManagementInboundIndexRoute
  '/finished-production-inoutbound': typeof featuresLayoutFinishedProductionInoutboundIndexLazyRoute
  '/inventory': typeof featuresLayoutInventoryIndexLazyRoute
  '/product-incoming-inspection': typeof featuresLayoutProductIncomingInspectionIndexLazyRoute
  '/report': typeof featuresLayoutReportIndexLazyRoute
  '/transfer-management': typeof featuresLayoutTransferManagementIndexLazyRoute
  '/warehouse-export': typeof featuresLayoutWarehouseExportIndexLazyRoute
  '/warehouse-import': typeof featuresLayoutWarehouseImportIndexLazyRoute
  '/warehouse': typeof featuresLayoutWarehouseIndexLazyRoute
  '/preferences/account': typeof featuresPreferencesLayoutAccountIndexLazyRoute
  '/preferences/appearance-settings': typeof featuresPreferencesLayoutAppearanceSettingsIndexLazyRoute
  '/preferences/keybindings': typeof featuresPreferencesLayoutKeybindingsIndexLazyRoute
  '/warehouse/storage-details/$warehouseNum': typeof featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyRoute
}

export interface FileRoutesByTo {
  '/pubsub': typeof PubsubRoute
  '/': typeof publicIndexRoute
  '/preferences': typeof featuresPreferencesLayoutRouteWithChildren
  '/authorization': typeof authAuthorizationIndexRoute
  '/login': typeof authLoginIndexRoute
  '/dashboard': typeof featuresLayoutDashboardIndexRoute
  '/production-management-inbound': typeof featuresLayoutProductionManagementInboundIndexRoute
  '/finished-production-inoutbound': typeof featuresLayoutFinishedProductionInoutboundIndexLazyRoute
  '/inventory': typeof featuresLayoutInventoryIndexLazyRoute
  '/product-incoming-inspection': typeof featuresLayoutProductIncomingInspectionIndexLazyRoute
  '/report': typeof featuresLayoutReportIndexLazyRoute
  '/transfer-management': typeof featuresLayoutTransferManagementIndexLazyRoute
  '/warehouse-export': typeof featuresLayoutWarehouseExportIndexLazyRoute
  '/warehouse-import': typeof featuresLayoutWarehouseImportIndexLazyRoute
  '/warehouse': typeof featuresLayoutWarehouseIndexLazyRoute
  '/preferences/account': typeof featuresPreferencesLayoutAccountIndexLazyRoute
  '/preferences/appearance-settings': typeof featuresPreferencesLayoutAppearanceSettingsIndexLazyRoute
  '/preferences/keybindings': typeof featuresPreferencesLayoutKeybindingsIndexLazyRoute
  '/warehouse/storage-details/$warehouseNum': typeof featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/pubsub': typeof PubsubRoute
  '/(features)': typeof featuresRouteWithChildren
  '/(features)/_layout': typeof featuresLayoutRouteWithChildren
  '/(public)/': typeof publicIndexRoute
  '/(features)/preferences': typeof featuresPreferencesRouteWithChildren
  '/(features)/preferences/_layout': typeof featuresPreferencesLayoutRouteWithChildren
  '/(auth)/authorization/': typeof authAuthorizationIndexRoute
  '/(auth)/login/': typeof authLoginIndexRoute
  '/(features)/_layout/dashboard/': typeof featuresLayoutDashboardIndexRoute
  '/(features)/_layout/production-management-inbound/': typeof featuresLayoutProductionManagementInboundIndexRoute
  '/(features)/_layout/finished-production-inoutbound/': typeof featuresLayoutFinishedProductionInoutboundIndexLazyRoute
  '/(features)/_layout/inventory/': typeof featuresLayoutInventoryIndexLazyRoute
  '/(features)/_layout/product-incoming-inspection/': typeof featuresLayoutProductIncomingInspectionIndexLazyRoute
  '/(features)/_layout/report/': typeof featuresLayoutReportIndexLazyRoute
  '/(features)/_layout/transfer-management/': typeof featuresLayoutTransferManagementIndexLazyRoute
  '/(features)/_layout/warehouse-export/': typeof featuresLayoutWarehouseExportIndexLazyRoute
  '/(features)/_layout/warehouse-import/': typeof featuresLayoutWarehouseImportIndexLazyRoute
  '/(features)/_layout/warehouse/': typeof featuresLayoutWarehouseIndexLazyRoute
  '/(features)/preferences/_layout/account/': typeof featuresPreferencesLayoutAccountIndexLazyRoute
  '/(features)/preferences/_layout/appearance-settings/': typeof featuresPreferencesLayoutAppearanceSettingsIndexLazyRoute
  '/(features)/preferences/_layout/keybindings/': typeof featuresPreferencesLayoutKeybindingsIndexLazyRoute
  '/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/': typeof featuresLayoutWarehouseLayoutStorageDetailsWarehouseNumIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/pubsub'
    | '/'
    | '/preferences'
    | '/authorization'
    | '/login'
    | '/dashboard'
    | '/production-management-inbound'
    | '/finished-production-inoutbound'
    | '/inventory'
    | '/product-incoming-inspection'
    | '/report'
    | '/transfer-management'
    | '/warehouse-export'
    | '/warehouse-import'
    | '/warehouse'
    | '/preferences/account'
    | '/preferences/appearance-settings'
    | '/preferences/keybindings'
    | '/warehouse/storage-details/$warehouseNum'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/pubsub'
    | '/'
    | '/preferences'
    | '/authorization'
    | '/login'
    | '/dashboard'
    | '/production-management-inbound'
    | '/finished-production-inoutbound'
    | '/inventory'
    | '/product-incoming-inspection'
    | '/report'
    | '/transfer-management'
    | '/warehouse-export'
    | '/warehouse-import'
    | '/warehouse'
    | '/preferences/account'
    | '/preferences/appearance-settings'
    | '/preferences/keybindings'
    | '/warehouse/storage-details/$warehouseNum'
  id:
    | '__root__'
    | '/pubsub'
    | '/(features)'
    | '/(features)/_layout'
    | '/(public)/'
    | '/(features)/preferences'
    | '/(features)/preferences/_layout'
    | '/(auth)/authorization/'
    | '/(auth)/login/'
    | '/(features)/_layout/dashboard/'
    | '/(features)/_layout/production-management-inbound/'
    | '/(features)/_layout/finished-production-inoutbound/'
    | '/(features)/_layout/inventory/'
    | '/(features)/_layout/product-incoming-inspection/'
    | '/(features)/_layout/report/'
    | '/(features)/_layout/transfer-management/'
    | '/(features)/_layout/warehouse-export/'
    | '/(features)/_layout/warehouse-import/'
    | '/(features)/_layout/warehouse/'
    | '/(features)/preferences/_layout/account/'
    | '/(features)/preferences/_layout/appearance-settings/'
    | '/(features)/preferences/_layout/keybindings/'
    | '/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  PubsubRoute: typeof PubsubRoute
  featuresRoute: typeof featuresRouteWithChildren
  publicIndexRoute: typeof publicIndexRoute
  authAuthorizationIndexRoute: typeof authAuthorizationIndexRoute
  authLoginIndexRoute: typeof authLoginIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  PubsubRoute: PubsubRoute,
  featuresRoute: featuresRouteWithChildren,
  publicIndexRoute: publicIndexRoute,
  authAuthorizationIndexRoute: authAuthorizationIndexRoute,
  authLoginIndexRoute: authLoginIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/pubsub",
        "/(features)",
        "/(public)/",
        "/(auth)/authorization/",
        "/(auth)/login/"
      ]
    },
    "/pubsub": {
      "filePath": "pubsub.tsx"
    },
    "/(features)": {
      "filePath": "(features)",
      "children": [
        "/(features)/_layout",
        "/(features)/preferences"
      ]
    },
    "/(features)/_layout": {
      "filePath": "(features)/_layout.tsx",
      "parent": "/(features)",
      "children": [
        "/(features)/_layout/dashboard/",
        "/(features)/_layout/production-management-inbound/",
        "/(features)/_layout/finished-production-inoutbound/",
        "/(features)/_layout/inventory/",
        "/(features)/_layout/product-incoming-inspection/",
        "/(features)/_layout/report/",
        "/(features)/_layout/transfer-management/",
        "/(features)/_layout/warehouse-export/",
        "/(features)/_layout/warehouse-import/",
        "/(features)/_layout/warehouse/",
        "/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/"
      ]
    },
    "/(public)/": {
      "filePath": "(public)/index.tsx"
    },
    "/(features)/preferences": {
      "filePath": "(features)/preferences",
      "parent": "/(features)",
      "children": [
        "/(features)/preferences/_layout"
      ]
    },
    "/(features)/preferences/_layout": {
      "filePath": "(features)/preferences/_layout.tsx",
      "parent": "/(features)/preferences",
      "children": [
        "/(features)/preferences/_layout/account/",
        "/(features)/preferences/_layout/appearance-settings/",
        "/(features)/preferences/_layout/keybindings/"
      ]
    },
    "/(auth)/authorization/": {
      "filePath": "(auth)/authorization/index.tsx"
    },
    "/(auth)/login/": {
      "filePath": "(auth)/login/index.tsx"
    },
    "/(features)/_layout/dashboard/": {
      "filePath": "(features)/_layout.dashboard/index.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/_layout/production-management-inbound/": {
      "filePath": "(features)/_layout.production-management-inbound/index.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/_layout/finished-production-inoutbound/": {
      "filePath": "(features)/_layout.finished-production-inoutbound/index.lazy.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/_layout/inventory/": {
      "filePath": "(features)/_layout.inventory/index.lazy.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/_layout/product-incoming-inspection/": {
      "filePath": "(features)/_layout.product-incoming-inspection/index.lazy.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/_layout/report/": {
      "filePath": "(features)/_layout.report/index.lazy.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/_layout/transfer-management/": {
      "filePath": "(features)/_layout.transfer-management/index.lazy.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/_layout/warehouse-export/": {
      "filePath": "(features)/_layout.warehouse-export/index.lazy.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/_layout/warehouse-import/": {
      "filePath": "(features)/_layout.warehouse-import/index.lazy.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/_layout/warehouse/": {
      "filePath": "(features)/_layout.warehouse/index.lazy.tsx",
      "parent": "/(features)/_layout"
    },
    "/(features)/preferences/_layout/account/": {
      "filePath": "(features)/preferences/_layout.account/index.lazy.tsx",
      "parent": "/(features)/preferences/_layout"
    },
    "/(features)/preferences/_layout/appearance-settings/": {
      "filePath": "(features)/preferences/_layout.appearance-settings/index.lazy.tsx",
      "parent": "/(features)/preferences/_layout"
    },
    "/(features)/preferences/_layout/keybindings/": {
      "filePath": "(features)/preferences/_layout.keybindings/index.lazy.tsx",
      "parent": "/(features)/preferences/_layout"
    },
    "/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/": {
      "filePath": "(features)/_layout.warehouse/_layout.storage-details.$warehouseNum/index.lazy.tsx",
      "parent": "/(features)/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
