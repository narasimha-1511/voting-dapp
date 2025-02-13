'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { clusterApiUrl, Connection } from '@solana/web3.js'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { ReactNode } from 'react'
import toast from 'react-hot-toast'

export enum ClusterNetwork {
  Mainnet = 'mainnet-beta',
  Devnet = 'devnet',
  Testnet = 'testnet',
}

export interface ClusterItem {
  name: string
  endpoint: string
  network?: ClusterNetwork
  active?: boolean
}

export interface ClusterContextState {
  cluster: ClusterItem
  clusters: ClusterItem[]
  connection: Connection
  getExplorerUrl: (path: string) => string
  setCluster: (cluster: ClusterItem) => void
  addCluster: (cluster: Partial<ClusterItem>) => void
  deleteCluster: (cluster: ClusterItem) => void
}

const DEFAULT_CLUSTERS: ClusterItem[] = [
  {
    name: 'Devnet',
    endpoint: clusterApiUrl('devnet'),
    network: ClusterNetwork.Devnet,
  },
  {
    name: 'Testnet',
    endpoint: clusterApiUrl('testnet'),
    network: ClusterNetwork.Testnet,
  },
  {
    name: 'Localnet',
    endpoint: 'http://127.0.0.1:8899',
  },
]

const ClusterContext = createContext<ClusterContextState>({} as ClusterContextState)

export function ClusterProvider({ children }: { children: ReactNode }) {
  const [clusters, setClusters] = useState<ClusterItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clusters')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return DEFAULT_CLUSTERS
  })

  const [activeCluster, setActiveCluster] = useState<ClusterItem>(() => {
    return clusters.find((item) => item.active) || clusters[0]
  })

  const [connection, setConnection] = useState<Connection>(
    new Connection(activeCluster.endpoint, 'confirmed')
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clusters', JSON.stringify(clusters))
    }
  }, [clusters])

  useEffect(() => {
    // Update connection when active cluster changes
    const newConnection = new Connection(activeCluster.endpoint, 'confirmed')
    setConnection(newConnection)
  }, [activeCluster])

  function setCluster(cluster: ClusterItem) {
    const updated = clusters.map((item) => ({
      ...item,
      active: item.endpoint === cluster.endpoint,
    }))
    setClusters(updated)
    setActiveCluster({ ...cluster, active: true })
  }

  function addCluster(cluster: Partial<ClusterItem>) {
    const newCluster = {
      ...cluster,
      name: cluster.name || `Custom ${clusters.length + 1}`,
      endpoint: cluster.endpoint || '',
    } as ClusterItem
    setClusters([...clusters, newCluster])
  }

  function deleteCluster(cluster: ClusterItem) {
    setClusters(clusters.filter((item) => item.endpoint !== cluster.endpoint))
  }

  function getExplorerUrl(path: string) {
    const endpoint = new URL(activeCluster.endpoint)
    const networkSuffix = endpoint.hostname.includes('devnet')
      ? '?cluster=devnet'
      : endpoint.hostname.includes('testnet')
      ? '?cluster=testnet'
      : ''
    return `https://explorer.solana.com/${path}${networkSuffix}`
  }

  return (
    <ClusterContext.Provider
      value={{
        cluster: activeCluster,
        clusters: clusters.map((item) => ({
          ...item,
          active: item.endpoint === activeCluster.endpoint,
        })),
        connection,
        getExplorerUrl,
        setCluster,
        addCluster,
        deleteCluster,
      }}
    >
      {children}
    </ClusterContext.Provider>
  )
}

export function useCluster() {
  return useContext(ClusterContext)
}
