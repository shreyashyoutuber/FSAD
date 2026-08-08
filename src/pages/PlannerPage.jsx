import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stage, Layer, Rect, Text as KonvaText, Line, Group, Transformer } from 'react-konva'
import { Toast, useToast } from '../components/Toast'
import FloorPlanner3DViewer from '../components/FloorPlanner3DViewer'

const STORAGE_KEY = 'bhv_planner_projects_v1'
const DEFAULT_UNIT = 'ft'
const CANVAS_W = 1180
const CANVAS_H = 760
const TOOLBAR_TOOLS = ['select', 'room', 'wall', 'door', 'window', 'staircase', 'furniture', 'dimension', 'text', 'parking', 'column', 'beam', 'plot', 'road', 'garden']
const FLOOR_LEVELS = ['Ground Floor', 'First Floor', 'Second Floor', 'Terrace']

const DEFAULT_REQUIREMENTS = {
    projectName: 'My 30×50 Home',
    plotWidth: 30,
    plotLength: 50,
    floors: 2,
    bedrooms: 3,
    bathrooms: 2,
    kitchen: 1,
    living: 1,
    dining: 1,
    pooja: 1,
    study: 1,
    parking: 1,
    balcony: 1,
    utility: 1,
    store: 1,
    staircase: 1,
    garden: 0,
    terrace: 1,
    homeOffice: 0,
    roadDirection: 'North',
    northDirection: 'Top',
    entranceDirection: 'East',
    budget: 6000000,
    vastu: true,
    style: 'Modern',
    specialRequirements: '',
    preferredRoomSizes: 'Living 15x18, Master Bedroom 14x16, Kitchen 10x12',
    unit: DEFAULT_UNIT,
    frontSetback: 4,
    rearSetback: 3,
    leftSetback: 3,
    rightSetback: 3,
    scale: '1:100',
}

const ROOM_PRESETS = {
    living: { width: 15, height: 18, fill: '#fff7ed', stroke: '#f97316' },
    kitchen: { width: 10, height: 12, fill: '#fff1f2', stroke: '#ef4444' },
    dining: { width: 12, height: 12, fill: '#fffbeb', stroke: '#f59e0b' },
    pooja: { width: 8, height: 8, fill: '#faf5ff', stroke: '#8b5cf6' },
    study: { width: 10, height: 12, fill: '#eff6ff', stroke: '#3b82f6' },
    bedroom: { width: 12, height: 14, fill: '#ecfeff', stroke: '#06b6d4' },
    masterBedroom: { width: 14, height: 16, fill: '#eef2ff', stroke: '#6366f1' },
    bathroom: { width: 6, height: 8, fill: '#f0fdfa', stroke: '#14b8a6' },
    staircase: { width: 8, height: 12, fill: '#e2e8f0', stroke: '#64748b' },
    parking: { width: 18, height: 18, fill: '#f8fafc', stroke: '#1e293b' },
    balcony: { width: 8, height: 12, fill: '#f0f9ff', stroke: '#0ea5e9' },
    utility: { width: 8, height: 10, fill: '#fdf2f8', stroke: '#db2777' },
    store: { width: 7, height: 8, fill: '#f8fafc', stroke: '#94a3b8' },
    garden: { width: 12, height: 10, fill: '#dcfce7', stroke: '#16a34a' },
    road: { width: 20, height: 6, fill: '#dbeafe', stroke: '#3b82f6' },
    wall: { width: 0.4, height: 10, fill: '#0f172a', stroke: '#0f172a' },
    door: { width: 3, height: 0.7, fill: '#d97706', stroke: '#b45309' },
    window: { width: 4, height: 0.5, fill: '#7dd3fc', stroke: '#0284c7' },
    room: { width: 10, height: 10, fill: '#fffaf3', stroke: '#f97316' },
    text: { width: 8, height: 4, fill: 'transparent', stroke: 'transparent' },
    column: { width: 1, height: 1, fill: '#334155', stroke: '#334155' },
    beam: { width: 8, height: 1, fill: '#475569', stroke: '#475569' },
    dimension: { width: 6, height: 1, fill: 'transparent', stroke: 'transparent' },
}

const kindLabels = {
    living: 'Living Room',
    kitchen: 'Kitchen',
    dining: 'Dining Room',
    pooja: 'Pooja Room',
    study: 'Study Room',
    bedroom: 'Bedroom',
    masterBedroom: 'Master Bedroom',
    bathroom: 'Bathroom',
    staircase: 'Staircase',
    parking: 'Parking',
    balcony: 'Balcony',
    utility: 'Utility',
    store: 'Store Room',
    garden: 'Garden',
    road: 'Road',
    wall: 'Wall',
    door: 'Door',
    window: 'Window',
    room: 'Room',
    text: 'Text',
    column: 'Column',
    beam: 'Beam',
    dimension: 'Dimension',
}

const furniturePresets = {
    bed: { width: 6.5, height: 7, fill: '#818cf8', stroke: '#4f46e5' },
    sofa: { width: 8, height: 3.5, fill: '#34d399', stroke: '#059669' },
    table: { width: 5, height: 3.5, fill: '#fbbf24', stroke: '#d97706' },
    chair: { width: 1.8, height: 1.8, fill: '#fb7185', stroke: '#e11d48' },
    diningTable: { width: 6.5, height: 4, fill: '#fdba74', stroke: '#ea580c' },
    wardrobe: { width: 5, height: 2.5, fill: '#c4b5fd', stroke: '#7c3aed' },
    tvUnit: { width: 5.5, height: 2, fill: '#38bdf8', stroke: '#0284c7' },
    kitchenCounter: { width: 7, height: 2.5, fill: '#fca5a5', stroke: '#dc2626' },
    toilet: { width: 2.5, height: 2.5, fill: '#99f6e4', stroke: '#14b8a6' },
    washBasin: { width: 2, height: 1.5, fill: '#bae6fd', stroke: '#0284c7' },
    studyTable: { width: 5, height: 2.5, fill: '#c7d2fe', stroke: '#4f46e5' },
    car: { width: 8.5, height: 16, fill: '#f8fafc', stroke: '#1f2937' },
    bike: { width: 3, height: 6, fill: '#fde68a', stroke: '#d97706' },
}

const clone = (value) => JSON.parse(JSON.stringify(value))
const uid = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const snap = (value, step = 0.5) => Math.round(value / step) * step

const unitConfig = {
    ft: {
        toFt: (v) => Number(v),
        fromFt: (v) => Number(v),
        format: (v) => `${Number(v).toFixed(1)} ft`,
    },
    m: {
        toFt: (v) => Number(v) / 0.3048,
        fromFt: (v) => Number(v) * 0.3048,
        format: (v) => `${(Number(v) * 0.3048).toFixed(2)} m`,
    },
    cm: {
        toFt: (v) => Number(v) / 30.48,
        fromFt: (v) => Number(v) * 30.48,
        format: (v) => `${(Number(v) * 30.48).toFixed(0)} cm`,
    },
    mm: {
        toFt: (v) => Number(v) / 304.8,
        fromFt: (v) => Number(v) * 304.8,
        format: (v) => `${(Number(v) * 304.8).toFixed(0)} mm`,
    },
}

const formatFeetInches = (feet) => {
    const totalInches = Math.round(Number(feet) * 12)
    const ft = Math.floor(totalInches / 12)
    const inches = totalInches % 12
    return `${ft}'-${inches}"`
}

const formatLength = (feet, unit) => {
    if (unit === 'ft') return formatFeetInches(feet)
    return unitConfig[unit].format(feet)
}

const displayArea = (sqFt, unit) => {
    if (unit === 'm') return `${(sqFt * 0.092903).toFixed(2)} sq.m`
    if (unit === 'cm') return `${(sqFt * 929.03).toFixed(0)} sq.cm`
    if (unit === 'mm') return `${(sqFt * 92903).toFixed(0)} sq.mm`
    return `${sqFt.toFixed(0)} sq.ft`
}

const createPlot = (plotWidth, plotLength, unit = 'ft') => ({
    id: uid('plot'),
    kind: 'plot',
    name: 'Plot Boundary',
    x: 0,
    y: 0,
    width: unitConfig[unit].toFt(plotWidth),
    height: unitConfig[unit].toFt(plotLength),
    rotation: 0,
    fill: 'transparent',
    stroke: '#0f172a',
    strokeWidth: 0.18,
    metadata: { material: 'Boundary wall', locked: true },
})

const createObject = ({ kind, name, x, y, width, height, rotation = 0, fill, stroke, strokeWidth, metadata = {} }) => ({
    id: uid(kind),
    kind,
    name: name || kindLabels[kind] || kind,
    x,
    y,
    width,
    height,
    rotation,
    fill: fill || '#ffffff',
    stroke: stroke || '#f97316',
    strokeWidth: strokeWidth ?? (kind === 'wall' ? 0.22 : 0.12),
    metadata,
})

const createFurniture = (kind, x, y, roomName = '') => {
    const preset = furniturePresets[kind] || furniturePresets.table
    return createObject({
        kind: 'furniture',
        name: roomName ? `${kindLabels[kind] || kind} - ${roomName}` : kindLabels[kind] || kind,
        x,
        y,
        width: preset.width,
        height: preset.height,
        fill: preset.fill,
        stroke: preset.stroke,
        metadata: { furnitureType: kind },
    })
}

const createRoom = (kind, x, y, width, height, extra = {}) => {
    const preset = ROOM_PRESETS[kind] || ROOM_PRESETS.room
    return createObject({
        kind: 'room',
        name: extra.name || kindLabels[kind] || 'Room',
        x,
        y,
        width,
        height,
        fill: extra.fill || preset.fill,
        stroke: extra.stroke || preset.stroke,
        metadata: {
            areaLabel: extra.areaLabel || '',
            roomType: kind,
            level: extra.level || 'Ground Floor',
            ...extra.metadata,
        },
    })
}

const createAuxObject = (kind, x, y, width, height, extra = {}) => {
    const preset = ROOM_PRESETS[kind] || ROOM_PRESETS.room
    return createObject({
        kind,
        name: extra.name || kindLabels[kind] || kind,
        x,
        y,
        width,
        height,
        fill: extra.fill || preset.fill,
        stroke: extra.stroke || preset.stroke,
        strokeWidth: extra.strokeWidth,
        metadata: extra.metadata || {},
    })
}

const createFloor = (name, level) => ({
    id: uid('floor'),
    name,
    level,
    elements: [],
    notes: '',
})

const createBlankProject = (name = 'Untitled Project', requirements = DEFAULT_REQUIREMENTS) => ({
    id: uid('project'),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    meta: {
        requirements: clone(requirements),
        unit: requirements.unit || 'ft',
        scale: requirements.scale || '1:100',
        mode: 'manual',
    },
    plot: {
        width: requirements.plotWidth,
        length: requirements.plotLength,
        unit: requirements.unit || 'ft',
        roadDirection: requirements.roadDirection,
        northDirection: requirements.northDirection,
        entranceDirection: requirements.entranceDirection,
        frontSetback: requirements.frontSetback,
        rearSetback: requirements.rearSetback,
        leftSetback: requirements.leftSetback,
        rightSetback: requirements.rightSetback,
        vastu: requirements.vastu,
        style: requirements.style,
        budget: requirements.budget,
    },
    floors: [createFloor('Ground Floor', 'Ground Floor')],
    versions: [],
})

const roomFactory = {
    living: (x, y) => createRoom('living', x, y, ROOM_PRESETS.living.width, ROOM_PRESETS.living.height, { name: 'Living Room', areaLabel: 'Living' }),
    kitchen: (x, y) => createRoom('kitchen', x, y, ROOM_PRESETS.kitchen.width, ROOM_PRESETS.kitchen.height, { name: 'Kitchen', areaLabel: 'Kitchen' }),
    dining: (x, y) => createRoom('dining', x, y, ROOM_PRESETS.dining.width, ROOM_PRESETS.dining.height, { name: 'Dining Room', areaLabel: 'Dining' }),
    pooja: (x, y) => createRoom('pooja', x, y, ROOM_PRESETS.pooja.width, ROOM_PRESETS.pooja.height, { name: 'Pooja Room', areaLabel: 'Pooja' }),
    study: (x, y) => createRoom('study', x, y, ROOM_PRESETS.study.width, ROOM_PRESETS.study.height, { name: 'Study Room', areaLabel: 'Study' }),
    bedroom: (x, y, label = 'Bedroom') => createRoom('bedroom', x, y, ROOM_PRESETS.bedroom.width, ROOM_PRESETS.bedroom.height, { name: label, areaLabel: label }),
    masterBedroom: (x, y) => createRoom('masterBedroom', x, y, ROOM_PRESETS.masterBedroom.width, ROOM_PRESETS.masterBedroom.height, { name: 'Master Bedroom', areaLabel: 'Master' }),
    bathroom: (x, y, label = 'Bathroom') => createRoom('bathroom', x, y, ROOM_PRESETS.bathroom.width, ROOM_PRESETS.bathroom.height, { name: label, areaLabel: 'Bath' }),
    staircase: (x, y) => createRoom('staircase', x, y, ROOM_PRESETS.staircase.width, ROOM_PRESETS.staircase.height, { name: 'Staircase', areaLabel: 'Stair' }),
    parking: (x, y) => createRoom('parking', x, y, ROOM_PRESETS.parking.width, ROOM_PRESETS.parking.height, { name: 'Parking', areaLabel: 'Parking' }),
    balcony: (x, y) => createRoom('balcony', x, y, ROOM_PRESETS.balcony.width, ROOM_PRESETS.balcony.height, { name: 'Balcony', areaLabel: 'Balcony' }),
    utility: (x, y) => createRoom('utility', x, y, ROOM_PRESETS.utility.width, ROOM_PRESETS.utility.height, { name: 'Utility', areaLabel: 'Utility' }),
    store: (x, y) => createRoom('store', x, y, ROOM_PRESETS.store.width, ROOM_PRESETS.store.height, { name: 'Store Room', areaLabel: 'Store' }),
    garden: (x, y) => createRoom('garden', x, y, ROOM_PRESETS.garden.width, ROOM_PRESETS.garden.height, { name: 'Garden', areaLabel: 'Garden' }),
    road: (x, y) => createAuxObject('road', x, y, ROOM_PRESETS.road.width, ROOM_PRESETS.road.height, { name: 'Road' }),
    wall: (x, y, width, height, rotation = 0) => createAuxObject('wall', x, y, width, height, { name: 'Wall', strokeWidth: 0.18, metadata: { fixed: false }, rotation }),
    door: (x, y) => createAuxObject('door', x, y, ROOM_PRESETS.door.width, ROOM_PRESETS.door.height, { name: 'Door', strokeWidth: 0.1, metadata: { opening: 'Left' } }),
    window: (x, y) => createAuxObject('window', x, y, ROOM_PRESETS.window.width, ROOM_PRESETS.window.height, { name: 'Window', strokeWidth: 0.1, metadata: { type: 'sliding' } }),
    column: (x, y) => createAuxObject('column', x, y, ROOM_PRESETS.column.width, ROOM_PRESETS.column.height, { name: 'Column', fill: '#334155', stroke: '#334155' }),
    beam: (x, y, width) => createAuxObject('beam', x, y, width, ROOM_PRESETS.beam.height, { name: 'Beam', fill: '#475569', stroke: '#475569' }),
    dimension: (x, y, width, height, label) => createAuxObject('dimension', x, y, width, height, { name: label || 'Dimension', fill: 'transparent', stroke: 'transparent' }),
    text: (x, y, label) => createAuxObject('text', x, y, 6, 2, { name: label, fill: 'transparent', stroke: 'transparent' }),
}

function loadSavedProjects(email) {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${email || 'guest'}`)
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function persistSavedProjects(email, projects) {
    localStorage.setItem(`${STORAGE_KEY}:${email || 'guest'}`, JSON.stringify(projects))
}

function summarizePlan(project) {
    const activeFloor = project.floors[0]
    const rooms = activeFloor.elements.filter(el => el.kind === 'room').length
    const furniture = activeFloor.elements.filter(el => el.kind === 'furniture').length
    return {
        roomCount: rooms,
        furnitureCount: furniture,
        plotArea: project.plot.width * project.plot.length,
        buildableArea: Math.max(0, (project.plot.width - project.plot.leftSetback - project.plot.rightSetback) * (project.plot.length - project.plot.frontSetback - project.plot.rearSetback)),
    }
}

function generateGroundFloor(req) {
    const plot = { width: req.plotWidth, length: req.plotLength }
    const front = req.frontSetback
    const rear = req.rearSetback
    const left = req.leftSetback
    const right = req.rightSetback
    const usableW = plot.width - left - right
    const usableL = plot.length - front - rear
    const margin = 0.6
    const room = []

    room.push(roomFactory.road(plot.width * 0.25, plot.length + 1))
    room.push(createAuxObject('plot', 0, 0, plot.width, plot.length, { name: 'Plot Boundary', fill: 'transparent', stroke: '#0f172a', strokeWidth: 0.18, metadata: { locked: true } }))
    room.push(createAuxObject('dimension', plot.width * 0.4, -1.5, 6, 1, { name: `${formatLength(plot.width, req.unit)} wide`, fill: 'transparent', stroke: 'transparent' }))

    if (req.parking > 0) {
        room.push(roomFactory.parking(left + margin, front + margin))
        room.push(createFurniture('car', left + margin + 1.2, front + margin + 1.5, 'Parking'))
    }

    room.push(roomFactory.living(left + 2, front + 2))
    if (req.dining > 0) room.push(roomFactory.dining(left + usableW * 0.38, front + 4))
    if (req.kitchen > 0) room.push(roomFactory.kitchen(left + usableW - ROOM_PRESETS.kitchen.width - 1.5, front + usableL - ROOM_PRESETS.kitchen.height - 1.5))
    if (req.pooja > 0) room.push(roomFactory.pooja(left + usableW - ROOM_PRESETS.pooja.width - 0.8, front + 0.9))
    if (req.staircase > 0) room.push(roomFactory.staircase(left + usableW * 0.44, front + usableL * 0.22))
    if (req.utility > 0) room.push(roomFactory.utility(left + usableW * 0.08, front + usableL - 11))
    if (req.store > 0) room.push(roomFactory.store(left + usableW * 0.16, front + usableL - 12))
    if (req.bedrooms > 0) room.push(roomFactory.bedroom(left + 2, front + usableL * 0.48, 'Bedroom 1'))
    if (req.bathrooms > 0) room.push(roomFactory.bathroom(left + usableW * 0.28, front + usableL * 0.52, 'Common Bath'))
    if (req.garden > 0) room.push(roomFactory.garden(left + usableW * 0.1, front - 2.5))

    room.push(createFurniture('sofa', left + 3, front + 3.5, 'Living'))
    room.push(createFurniture('diningTable', left + usableW * 0.42, front + 6.5, 'Dining'))
    room.push(createFurniture('kitchenCounter', left + usableW - 10.5, front + usableL - 4.5, 'Kitchen'))
    room.push(createFurniture('wardrobe', left + 3, front + usableL * 0.54, 'Bedroom 1'))

    room.push(createAuxObject('door', left + usableW * 0.6, front, 3.2, 0.8, { name: 'Main Door', metadata: { opening: req.entranceDirection } }))
    room.push(createAuxObject('window', left + 1.5, front + 8, 4, 0.5, { name: 'Window' }))
    room.push(createAuxObject('window', left + usableW - 5.8, front + 12, 4, 0.5, { name: 'Window' }))
    room.push(createAuxObject('door', left + usableW * 0.35, front + usableL * 0.46, 2.8, 0.8, { name: 'Room Door' }))
    room.push(createAuxObject('door', left + usableW - 4.5, front + usableL - 10.8, 2.8, 0.8, { name: 'Kitchen Door' }))

    return room
}

function generateUpperFloor(req, floorIndex) {
    const plot = { width: req.plotWidth, length: req.plotLength }
    const left = req.leftSetback
    const right = req.rightSetback
    const front = req.frontSetback
    const rear = req.rearSetback
    const usableW = plot.width - left - right
    const usableL = plot.length - front - rear
    const element = []

    element.push(createAuxObject('plot', 0, 0, plot.width, plot.length, { name: 'Plot Boundary', fill: 'transparent', stroke: '#0f172a', strokeWidth: 0.18, metadata: { locked: true } }))
    element.push(roomFactory.road(plot.width * 0.25, plot.length + 1))

    const bedroomCount = Math.max(2, req.bedrooms - (floorIndex === 1 ? 1 : 2))
    const baseBedW = 12
    const baseBedH = 14

    element.push(roomFactory.masterBedroom(left + 2, front + 2))
    element.push(roomFactory.bedroom(left + usableW * 0.42, front + 2, 'Bedroom 2'))
    if (bedroomCount > 2) element.push(roomFactory.bedroom(left + usableW * 0.42, front + usableL * 0.46, 'Bedroom 3'))
    if (bedroomCount > 3) element.push(roomFactory.bedroom(left + 2, front + usableL * 0.46, 'Bedroom 4'))

    if (req.study > 0) element.push(roomFactory.study(left + usableW - 11.5, front + 2))
    if (req.balcony > 0) element.push(roomFactory.balcony(left + usableW - 9, front + usableL - 13))
    if (req.bathrooms > 0) element.push(roomFactory.bathroom(left + usableW - 7.5, front + usableL * 0.5, 'Bath'))
    if (req.staircase > 0) element.push(roomFactory.staircase(left + usableW * 0.42, front + usableL * 0.22))
    if (req.homeOffice > 0) element.push(roomFactory.study(left + 2, front + usableL - 13))
    if (req.terrace > 0 && floorIndex === 1) element.push(roomFactory.garden(left + usableW * 0.42, front + usableL - 12, 'Terrace'))

    element.push(createFurniture('bed', left + 3, front + 3.5, 'Master Bedroom'))
    element.push(createFurniture('bed', left + usableW * 0.45, front + 3.5, 'Bedroom 2'))
    if (bedroomCount > 2) element.push(createFurniture('bed', left + usableW * 0.45, front + usableL * 0.5, 'Bedroom 3'))
    if (req.study > 0) element.push(createFurniture('studyTable', left + usableW - 9.5, front + 3, 'Study'))
    if (req.balcony > 0) element.push(createFurniture('sofa', left + usableW - 7.5, front + usableL - 11, 'Balcony'))
    element.push(createAuxObject('window', left + 1.5, front + 8, 4, 0.5, { name: 'Window' }))
    element.push(createAuxObject('window', left + usableW - 5.8, front + 8, 4, 0.5, { name: 'Window' }))
    element.push(createAuxObject('door', left + usableW * 0.52, front, 3.2, 0.8, { name: 'Stair Lobby Door' }))

    return element
}

function generateTerraceFloor(req) {
    const plot = { width: req.plotWidth, length: req.plotLength }
    const left = req.leftSetback
    const right = req.rightSetback
    const front = req.frontSetback
    const rear = req.rearSetback
    const usableW = plot.width - left - right
    const usableL = plot.length - front - rear
    const elements = []

    elements.push(createAuxObject('plot', 0, 0, plot.width, plot.length, { name: 'Plot Boundary', fill: 'transparent', stroke: '#0f172a', strokeWidth: 0.18, metadata: { locked: true } }))
    elements.push(roomFactory.garden(left + 2, front + 2, 'Terrace Garden'))
    elements.push(roomFactory.utility(left + usableW - 10, front + 2, 'Utility Zone'))
    elements.push(roomFactory.staircase(left + usableW * 0.42, front + usableL * 0.22))
    elements.push(createFurniture('table', left + 4, front + 5, 'Terrace'))
    elements.push(createFurniture('chair', left + 5, front + 10, 'Terrace'))
    elements.push(createFurniture('chair', left + 7, front + 10, 'Terrace'))
    elements.push(createAuxObject('window', left + 2, front + 12, 4, 0.5, { name: 'Vent' }))

    return elements
}

function generatePlanFromRequirements(req) {
    const requirements = { ...DEFAULT_REQUIREMENTS, ...req }
    const project = createBlankProject(requirements.projectName, requirements)
    project.plot = {
        width: requirements.plotWidth,
        length: requirements.plotLength,
        unit: requirements.unit || 'ft',
        roadDirection: requirements.roadDirection,
        northDirection: requirements.northDirection,
        entranceDirection: requirements.entranceDirection,
        frontSetback: requirements.frontSetback,
        rearSetback: requirements.rearSetback,
        leftSetback: requirements.leftSetback,
        rightSetback: requirements.rightSetback,
        vastu: requirements.vastu,
        style: requirements.style,
        budget: requirements.budget,
    }
    project.meta = { requirements: clone(requirements), unit: requirements.unit || 'ft', scale: requirements.scale || '1:100', mode: 'ai' }

    const floorCount = clamp(Number(requirements.floors || 1), 1, 4)
    project.floors = []

    for (let i = 0; i < floorCount; i += 1) {
        const floor = createFloor(FLOOR_LEVELS[i] || `Floor ${i + 1}`, FLOOR_LEVELS[i] || `Floor ${i + 1}`)
        if (i === 0) floor.elements = generateGroundFloor(requirements)
        else if (i === floorCount - 1 && requirements.terrace > 0 && i > 1) floor.elements = generateTerraceFloor(requirements)
        else if (i === 1 && floorCount > 1) floor.elements = generateUpperFloor(requirements, i)
        else floor.elements = generateUpperFloor(requirements, i)
        project.floors.push(floor)
    }

    project.versions = [
        {
            id: uid('version'),
            label: 'Version 1',
            createdAt: new Date().toISOString(),
            snapshot: clone(project),
        },
    ]

    return project
}

function scaleRoomByName(project, floorId, matcher, factor = 1.1) {
    const next = clone(project)
    const floor = next.floors.find(f => f.id === floorId) || next.floors[0]
    if (!floor) return project
    const room = floor.elements.find(el => el.kind === 'room' && matcher.test(el.name))
    if (!room) return project
    room.width = snap(room.width * factor, 0.1)
    room.height = snap(room.height * factor, 0.1)
    return next
}

function addRoomNearEntrance(project, floorId, roomName, roomKind = 'bedroom') {
    const next = clone(project)
    const floor = next.floors.find(f => f.id === floorId) || next.floors[0]
    if (!floor) return project
    const plot = next.plot
    const width = ROOM_PRESETS[roomKind]?.width || 10
    const height = ROOM_PRESETS[roomKind]?.height || 12
    const x = plot.leftSetback + 2
    const y = plot.frontSetback + 1.5
    floor.elements.push(createRoom(roomKind, x, y, width, height, { name: roomName, areaLabel: roomName }))
    floor.elements.push(createAuxObject('door', x + 2, y, 2.8, 0.8, { name: `${roomName} Door` }))
    return next
}

function modifyPlanWithPrompt(project, prompt) {
    const text = (prompt || '').toLowerCase().trim()
    if (!text) return { project, message: 'Please type a modification request.' }

    if (/4\s*bhk|four bedroom|4 bedroom/.test(text)) {
        const req = clone(project.meta.requirements || DEFAULT_REQUIREMENTS)
        req.bedrooms = Math.max(req.bedrooms, 4)
        return { project: generatePlanFromRequirements(req), message: 'Generated a 4BHK version of the plan.' }
    }

    if (/add one more bedroom|more bedroom|extra bedroom/.test(text)) {
        const req = clone(project.meta.requirements || DEFAULT_REQUIREMENTS)
        req.bedrooms += 1
        return { project: generatePlanFromRequirements(req), message: 'Added one more bedroom and rebalanced the layout.' }
    }

    if (/kitchen.*bigger|bigger kitchen|increase kitchen/.test(text)) {
        return { project: scaleRoomByName(project, project.activeFloorId || project.floors[0].id, /kitchen/i, 1.15), message: 'Expanded the kitchen footprint.' }
    }

    if (/living.*bigger|bigger living|increase living/.test(text)) {
        return { project: scaleRoomByName(project, project.activeFloorId || project.floors[0].id, /living/i, 1.18), message: 'Expanded the living room.' }
    }

    if (/move staircase|staircase/.test(text)) {
        const next = clone(project)
        const floor = next.floors.find(f => f.id === (next.activeFloorId || next.floors[0].id)) || next.floors[0]
        const stair = floor.elements.find(el => el.kind === 'room' && /stair/i.test(el.name))
        if (stair) {
            stair.x = next.plot.width - next.plot.rightSetback - stair.width - 2
            stair.y = next.plot.frontSetback + 4
            return { project: next, message: 'Moved the staircase toward the front-right zone.' }
        }
        return { project: addRoomNearEntrance(project, floor.id, 'Staircase', 'staircase'), message: 'Added a staircase near the entrance side.' }
    }

    if (/parking.*2|2 car|two car/.test(text)) {
        const next = clone(project)
        const floor = next.floors[0]
        const parking = floor.elements.find(el => el.kind === 'room' && /parking/i.test(el.name))
        if (parking) {
            parking.width = 18
            parking.height = 20
            parking.name = '2-Car Parking'
            return { project: next, message: 'Upgraded parking to support two cars.' }
        }
        floor.elements.push(roomFactory.parking(next.plot.leftSetback + 1, next.plot.frontSetback + 1))
        floor.elements[floor.elements.length - 1].name = '2-Car Parking'
        floor.elements[floor.elements.length - 1].width = 18
        floor.elements[floor.elements.length - 1].height = 20
        return { project: next, message: 'Added two-car parking.' }
    }

    if (/pooja.*entrance|near the entrance|near entrance/.test(text)) {
        const next = addRoomNearEntrance(project, project.floors[0].id, 'Pooja Room', 'pooja')
        return { project: next, message: 'Added a pooja room close to the entrance.' }
    }

    if (/optimize.*30\s*[x×]\s*50|30\s*[x×]\s*50 plot/.test(text)) {
        const req = clone(project.meta.requirements || DEFAULT_REQUIREMENTS)
        req.plotWidth = 30
        req.plotLength = 50
        return { project: generatePlanFromRequirements(req), message: 'Re-optimized the plan for a 30 × 50 plot.' }
    }

    if (/vastu|vasto/.test(text)) {
        const req = clone(project.meta.requirements || DEFAULT_REQUIREMENTS)
        req.vastu = true
        return { project: generatePlanFromRequirements(req), message: 'Generated a Vastu-friendly version of the plan.' }
    }

    if (/make the kitchen 15.*18|kitchen.*15.*18/.test(text)) {
        const next = clone(project)
        const floor = next.floors[0]
        const kitchen = floor.elements.find(el => el.kind === 'room' && /kitchen/i.test(el.name))
        if (kitchen) {
            kitchen.width = 15
            kitchen.height = 18
            kitchen.x = next.plot.width - next.plot.rightSetback - kitchen.width - 2
            kitchen.y = next.plot.frontSetback + next.plot.length * 0.58
            return { project: next, message: 'Set the kitchen to 15 × 18 ft.' }
        }
    }

    return { project, message: 'I understood the request, but it needs a more specific instruction. Try: add a bedroom, make the kitchen bigger, or add parking for 2 cars.' }
}

function PlannerObject({ element, isSelected, onSelect, onDragEnd, onTransformEnd, nodeRef, scale }) {
    const baseStyle = {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation || 0,
        draggable: !element.metadata?.locked,
        onClick: (e) => { e.cancelBubble = true; onSelect(element.id) },
        onTap: (e) => { e.cancelBubble = true; onSelect(element.id) },
        onDragEnd,
        ref: nodeRef,
    }

    const roomLabel = element.kind === 'room' && element.name ? element.name : null
    const area = element.kind === 'room' ? `${displayArea(element.width * element.height, 'ft')}` : ''

    return (
        <>
            <Rect
                {...baseStyle}
                fill={element.fill || '#fff'}
                stroke={isSelected ? '#fb923c' : element.stroke || '#f97316'}
                strokeWidth={isSelected ? 0.22 : element.strokeWidth || 0.12}
                dash={element.kind === 'road' ? [6, 4] : element.kind === 'dimension' ? [4, 4] : undefined}
                cornerRadius={element.kind === 'door' ? 0.08 : element.kind === 'window' ? 0.05 : 0.16}
                onTransformEnd={onTransformEnd}
            />
            {roomLabel && (
                <>
                    <KonvaText
                        x={element.x + 0.5}
                        y={element.y + 0.55}
                        width={Math.max(1, element.width - 1)}
                        text={roomLabel}
                        fontSize={0.72}
                        fontStyle="bold"
                        fill="#0f172a"
                        align="center"
                        listening={false}
                    />
                    <KonvaText
                        x={element.x + 0.5}
                        y={element.y + 1.35}
                        width={Math.max(1, element.width - 1)}
                        text={area}
                        fontSize={0.45}
                        fill="#475569"
                        align="center"
                        listening={false}
                    />
                </>
            )}
            {element.kind === 'plot' && (
                <KonvaText
                    x={element.x + element.width / 2 - 4}
                    y={element.y - 1.2}
                    text={`North Wall (${formatFeetInches(element.width)})`}
                    fontSize={0.48}
                    fill="#475569"
                    listening={false}
                />
            )}
            {element.kind === 'door' && (
                <KonvaText
                    x={element.x}
                    y={element.y - 0.55}
                    text="Door"
                    fontSize={0.34}
                    fill="#b45309"
                    listening={false}
                />
            )}
            {element.kind === 'window' && (
                <KonvaText
                    x={element.x}
                    y={element.y - 0.45}
                    text="Window"
                    fontSize={0.34}
                    fill="#0369a1"
                    listening={false}
                />
            )}
        </>
    )
}

export default function PlannerPage() {
    const navigate = useNavigate()
    const { toasts, toast, removeToast } = useToast()
    const stageRef = useRef(null)
    const transformerRef = useRef(null)
    const nodeRefs = useRef({})
    const canvasWrapRef = useRef(null)

    const userEmail = JSON.parse(localStorage.getItem('user') || '{}')?.email || 'guest'
    const [mode, setMode] = useState('ai')
    const [viewMode, setViewMode] = useState('2d')
    const [unit, setUnit] = useState(DEFAULT_UNIT)
    const [gridOn, setGridOn] = useState(true)
    const [snapOn, setSnapOn] = useState(true)
    const [measureOn, setMeasureOn] = useState(true)
    const [zoom, setZoom] = useState(1)
    const [stageOffset, setStageOffset] = useState({ x: 60, y: 80 })
    const [activeTool, setActiveTool] = useState('select')
    const [selectedElementId, setSelectedElementId] = useState(null)
    const [selectedFloorId, setSelectedFloorId] = useState(null)
    const [drawing, setDrawing] = useState(null)
    const [aiPrompt, setAiPrompt] = useState('')
    const [projectName, setProjectName] = useState('My 30×50 Home')
    const [projectList, setProjectList] = useState([])
    const [projectId, setProjectId] = useState(null)
    const [history, setHistory] = useState([])
    const [future, setFuture] = useState([])
    const [aiRequest, setAiRequest] = useState({ ...DEFAULT_REQUIREMENTS })
    const [project, setProject] = useState(() => generatePlanFromRequirements(DEFAULT_REQUIREMENTS))

    const canvasWidth = 1100
    const canvasHeight = 740
    const baseScale = useMemo(() => {
        const plot = project.plot
        const fitX = (canvasWidth - 220) / plot.width
        const fitY = (canvasHeight - 160) / plot.length
        return Math.max(10, Math.min(fitX, fitY))
    }, [project.plot])

    const scale = baseScale * zoom
    const activeFloor = useMemo(() => project.floors.find(f => f.id === (selectedFloorId || project.floors[0]?.id)) || project.floors[0], [project, selectedFloorId])
    const activeFloorId = activeFloor?.id || null
    const floorElements = activeFloor?.elements || []
    const selectedElement = floorElements.find(el => el.id === selectedElementId) || null

    useEffect(() => {
        setSelectedFloorId(project.floors[0]?.id || null)
    }, [project.id])

    useEffect(() => {
        const saved = loadSavedProjects(userEmail)
        setProjectList(saved)
        if (saved.length > 0) {
            const current = saved[0]
            setProject(current)
            setProjectId(current.id)
            setProjectName(current.name)
            setAiRequest(current.meta?.requirements || DEFAULT_REQUIREMENTS)
            setUnit(current.plot?.unit || DEFAULT_UNIT)
            setSelectedFloorId(current.floors[0]?.id || null)
        }
    }, [userEmail])

    useEffect(() => {
        if (!transformerRef.current) return
        const selectedNode = selectedElementId ? nodeRefs.current[selectedElementId] : null
        if (selectedNode) {
            transformerRef.current.nodes([selectedNode])
            transformerRef.current.getLayer()?.batchDraw()
        } else {
            transformerRef.current.nodes([])
            transformerRef.current.getLayer()?.batchDraw()
        }
    }, [selectedElementId, activeFloorId, project.floors.length])

    const pushHistory = (nextProject) => {
        setHistory(prev => [...prev, clone(project)])
        setFuture([])
        setProject({ ...nextProject, updatedAt: new Date().toISOString() })
    }

    const screenToWorld = (point) => ({
        x: (point.x - stageOffset.x) / scale,
        y: (point.y - stageOffset.y) / scale,
    })

    const worldToScreen = (point) => ({
        x: point.x * scale + stageOffset.x,
        y: point.y * scale + stageOffset.y,
    })

    const updateProject = (updater, recordHistory = true) => {
        setProject(prev => {
            const next = typeof updater === 'function' ? updater(clone(prev)) : updater
            if (recordHistory) {
                setHistory(h => [...h, clone(prev)])
                setFuture([])
            }
            return { ...next, updatedAt: new Date().toISOString() }
        })
    }

    const updateFloor = (floorId, updater) => {
        updateProject((current) => {
            const floorIndex = current.floors.findIndex(f => f.id === floorId)
            if (floorIndex < 0) return current
            current.floors[floorIndex] = updater(clone(current.floors[floorIndex]))
            return current
        })
    }

    const persistCurrentProject = (currentProject) => {
        const saved = loadSavedProjects(userEmail)
        const next = currentProject.id ? saved.filter(p => p.id !== currentProject.id) : saved
        const merged = [{ ...currentProject, id: currentProject.id || uid('project') }, ...next]
        persistSavedProjects(userEmail, merged)
        setProjectList(merged)
        setProjectId(currentProject.id)
    }

    const saveCurrentProject = (asNew = false) => {
        const nextProject = clone(project)
        if (asNew || !nextProject.id) nextProject.id = uid('project')
        nextProject.name = projectName || 'Untitled Project'
        persistCurrentProject(nextProject)
        setProject(nextProject)
        toast.success(asNew ? 'Saved as new project.' : 'Project saved.')
    }

    const loadProject = (id) => {
        const saved = loadSavedProjects(userEmail)
        const found = saved.find(p => p.id === id)
        if (!found) return
        setProject(found)
        setProjectId(found.id)
        setProjectName(found.name)
        setAiRequest(found.meta?.requirements || DEFAULT_REQUIREMENTS)
        setUnit(found.plot?.unit || DEFAULT_UNIT)
        setSelectedFloorId(found.floors[0]?.id || null)
        setSelectedElementId(null)
        toast.info(`Loaded ${found.name}`)
    }

    const handleUndo = () => {
        if (history.length === 0) return
        const previous = history[history.length - 1]
        setHistory(prev => prev.slice(0, -1))
        setFuture(prev => [clone(project), ...prev])
        setProject(previous)
    }

    const handleRedo = () => {
        if (future.length === 0) return
        const next = future[0]
        setFuture(prev => prev.slice(1))
        setHistory(prev => [...prev, clone(project)])
        setProject(next)
    }

    const setPlotDimension = (field, value) => {
        const ftValue = unitConfig[unit].toFt(value)
        updateProject((current) => {
            current.plot[field] = ftValue
            current.meta.requirements[field === 'width' ? 'plotWidth' : 'plotLength'] = ftValue
            return current
        })
    }

    const handleGenerateAI = () => {
        const next = generatePlanFromRequirements({ ...DEFAULT_REQUIREMENTS, ...aiRequest, unit })
        next.name = aiRequest.projectName || projectName
        next.id = projectId || uid('project')
        next.activeFloorId = next.floors[0]?.id || null
        setProject(next)
        setProjectName(next.name)
        setSelectedFloorId(next.floors[0]?.id || null)
        setSelectedElementId(null)
        setMode('manual')
        toast.success('AI floor plan generated.')
    }

    const handleAiModify = () => {
        const result = modifyPlanWithPrompt(project, aiPrompt)
        if (result.project !== project) {
            setProject(result.project)
            setProjectName(result.project.name || projectName)
            setSelectedFloorId(result.project.floors[0]?.id || null)
            setSelectedElementId(null)
            setHistory(prev => [...prev, clone(project)])
            setFuture([])
        }
        toast.info(result.message)
    }

    const handleAddFloor = () => {
        const next = clone(project)
        const floorIndex = next.floors.length
        const name = FLOOR_LEVELS[floorIndex] || `Floor ${floorIndex + 1}`
        const floor = createFloor(name, name)
        floor.elements = generateUpperFloor(next.meta.requirements || DEFAULT_REQUIREMENTS, floorIndex)
        next.floors.push(floor)
        updateProject(next)
        setSelectedFloorId(floor.id)
        toast.success(`${name} added.`)
    }

    const handleCopyFloor = () => {
        const next = clone(project)
        const active = next.floors.find(f => f.id === activeFloorId) || next.floors[0]
        if (!active) return
        const duplicate = clone(active)
        duplicate.id = uid('floor')
        duplicate.name = `${active.name} Copy`
        next.floors.push(duplicate)
        updateProject(next)
        setSelectedFloorId(duplicate.id)
        toast.success('Floor copied.')
    }

    const handleSaveVersion = () => {
        const next = clone(project)
        const versionNumber = (next.versions?.length || 0) + 1
        next.versions = next.versions || []
        next.versions.unshift({
            id: uid('version'),
            label: `Version ${versionNumber}`,
            createdAt: new Date().toISOString(),
            snapshot: clone(project),
        })
        updateProject(next)
        toast.success(`Saved Version ${versionNumber}`)
    }

    const handleRestoreVersion = (snapshot) => {
        const restored = clone(snapshot)
        setProject(restored)
        setSelectedFloorId(restored.floors[0]?.id || null)
        setSelectedElementId(null)
        toast.warning('Version restored.')
    }

    const handleDeleteSelected = () => {
        if (!selectedElementId) return
        updateFloor(activeFloorId, (floor) => {
            floor.elements = floor.elements.filter(el => el.id !== selectedElementId)
            return floor
        })
        setSelectedElementId(null)
        toast.info('Element deleted.')
    }

    const handleDuplicateSelected = () => {
        if (!selectedElement) return
        updateFloor(activeFloorId, (floor) => {
            const copy = clone(selectedElement)
            copy.id = uid(copy.kind)
            copy.x += 1.2
            copy.y += 1.2
            floor.elements.push(copy)
            return floor
        })
        toast.info('Element duplicated.')
    }

    const handleUpdateSelected = (patch) => {
        if (!selectedElement) return
        updateFloor(activeFloorId, (floor) => {
            floor.elements = floor.elements.map(el => (el.id === selectedElementId ? { ...el, ...patch } : el))
            return floor
        })
    }

    const placeToolAt = (tool, point) => {
        const world = snapOn ? { x: snap(point.x), y: snap(point.y) } : point
        const floor = clone(activeFloor)
        const add = (element) => floor.elements.push(element)

        if (tool === 'room') add(roomFactory.bedroom(world.x, world.y, 'New Room'))
        else if (tool === 'wall') add(createAuxObject('wall', world.x, world.y, 8, 0.4, { name: 'Wall' }))
        else if (tool === 'door') add(createAuxObject('door', world.x, world.y, 3, 0.7, { name: 'Door' }))
        else if (tool === 'window') add(createAuxObject('window', world.x, world.y, 4, 0.5, { name: 'Window' }))
        else if (tool === 'staircase') add(roomFactory.staircase(world.x, world.y))
        else if (tool === 'parking') add(roomFactory.parking(world.x, world.y))
        else if (tool === 'garden') add(roomFactory.garden(world.x, world.y))
        else if (tool === 'column') add(createAuxObject('column', world.x, world.y, 1, 1, { name: 'Column' }))
        else if (tool === 'beam') add(createAuxObject('beam', world.x, world.y, 8, 1, { name: 'Beam' }))
        else if (tool === 'text') add(createAuxObject('text', world.x, world.y, 6, 2, { name: 'Text' }))
        else if (tool === 'dimension') add(createAuxObject('dimension', world.x, world.y, 6, 1, { name: 'Dimension' }))
        else if (tool === 'furniture') add(createFurniture('sofa', world.x, world.y, 'Furniture'))
        else if (tool === 'plot') add(createAuxObject('plot', 0, 0, project.plot.width, project.plot.length, { name: 'Plot Boundary' }))
        else if (tool === 'road') add(createAuxObject('road', world.x, world.y, 18, 5, { name: 'Road' }))
        else if (tool === 'living') add(roomFactory.living(world.x, world.y))
        else if (tool === 'kitchen') add(roomFactory.kitchen(world.x, world.y))
        else if (tool === 'dining') add(roomFactory.dining(world.x, world.y))
        else if (tool === 'pooja') add(roomFactory.pooja(world.x, world.y))
        else if (tool === 'study') add(roomFactory.study(world.x, world.y))
        else if (tool === 'bathroom') add(roomFactory.bathroom(world.x, world.y))
        else if (tool === 'bedroom') add(roomFactory.bedroom(world.x, world.y))

        updateFloor(activeFloorId, () => floor)
        setSelectedElementId(null)
    }

    const drawingKinds = ['room', 'wall', 'plot', 'road', 'garden', 'parking', 'column', 'beam']
    const [draftRect, setDraftRect] = useState(null)

    const handleStageMouseDown = (e) => {
        if (e.target === e.target.getStage()) {
            setSelectedElementId(null)
        }
        if (activeTool === 'select') return
        const stage = e.target.getStage()
        const pos = screenToWorld(stage.getPointerPosition())
        if (drawingKinds.includes(activeTool)) {
            setDraftRect({ kind: activeTool, start: pos, current: pos })
        } else {
            placeToolAt(activeTool, pos)
        }
    }

    const handleStageMouseMove = (e) => {
        if (!draftRect) return
        const stage = e.target.getStage()
        setDraftRect(prev => ({ ...prev, current: screenToWorld(stage.getPointerPosition()) }))
    }

    const finalizeDraft = () => {
        if (!draftRect) return
        const x = Math.min(draftRect.start.x, draftRect.current.x)
        const y = Math.min(draftRect.start.y, draftRect.current.y)
        const width = Math.max(0.8, Math.abs(draftRect.current.x - draftRect.start.x))
        const height = Math.max(0.8, Math.abs(draftRect.current.y - draftRect.start.y))
        const floor = clone(activeFloor)
        if (draftRect.kind === 'room') floor.elements.push(createRoom('room', x, y, width, height, { name: 'Custom Room', areaLabel: 'Room' }))
        else if (draftRect.kind === 'wall') floor.elements.push(createAuxObject('wall', x, y, width, height, { name: 'Wall' }))
        else if (draftRect.kind === 'plot') floor.elements.push(createAuxObject('plot', 0, 0, project.plot.width, project.plot.length, { name: 'Plot Boundary' }))
        else if (draftRect.kind === 'road') floor.elements.push(createAuxObject('road', x, y, width, height, { name: 'Road' }))
        else if (draftRect.kind === 'garden') floor.elements.push(createRoom('garden', x, y, width, height, { name: 'Garden' }))
        else if (draftRect.kind === 'parking') floor.elements.push(createRoom('parking', x, y, width, height, { name: 'Parking' }))
        else if (draftRect.kind === 'column') floor.elements.push(createAuxObject('column', x, y, width, height, { name: 'Column' }))
        else if (draftRect.kind === 'beam') floor.elements.push(createAuxObject('beam', x, y, width, height, { name: 'Beam' }))
        updateFloor(activeFloorId, () => floor)
        setDraftRect(null)
    }

    const handleStageMouseUp = () => finalizeDraft()

    const handleTransformEnd = (id) => {
        const node = nodeRefs.current[id]
        if (!node) return
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        const nextWidth = clamp(node.width() * scaleX, 0.5, 1000)
        const nextHeight = clamp(node.height() * scaleY, 0.5, 1000)
        const nextRotation = node.rotation()
        node.scaleX(1)
        node.scaleY(1)
        updateFloor(activeFloorId, (floor) => {
            floor.elements = floor.elements.map(el => el.id === id ? { ...el, x: node.x(), y: node.y(), width: nextWidth, height: nextHeight, rotation: nextRotation } : el)
            return floor
        })
    }

    const handleDragEnd = (id, e) => {
        const node = e.target
        updateFloor(activeFloorId, (floor) => {
            floor.elements = floor.elements.map(el => el.id === id ? { ...el, x: snap(node.x(), 0.1), y: snap(node.y(), 0.1) } : el)
            return floor
        })
    }

    const handleExportPng = () => {
        const dataUrl = stageRef.current?.toDataURL({ pixelRatio: 2 })
        if (!dataUrl) return
        const link = document.createElement('a')
        link.download = `${projectName || 'planner'}.png`
        link.href = dataUrl
        link.click()
    }

    const handlePrint = () => {
        const dataUrl = stageRef.current?.toDataURL({ pixelRatio: 2 })
        if (!dataUrl) return
        const win = window.open('', '_blank')
        win?.document.write(`
            <html>
            <head>
                <title>${projectName}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
                    img { width: 100%; max-width: 1100px; border: 1px solid #e5e7eb; }
                    h1 { color: #ea580c; }
                </style>
            </head>
            <body>
                <h1>${projectName}</h1>
                <p>Preliminary AI-generated planning concept. Review with a qualified architect/engineer before construction.</p>
                <img src="${dataUrl}" />
                <script>window.print()</script>
            </body>
            </html>
        `)
        win?.document.close()
    }

    const projectSummary = summarizePlan(project)
    const previewItems = activeFloor.elements
        .filter(el => ['bedroom', 'masterBedroom', 'living', 'kitchen', 'dining', 'staircase', 'parking', 'garden', 'utility', 'balcony', 'furniture'].includes(el.kind))
        .map(el => ({
            id: el.id,
            type: el.kind === 'masterBedroom' ? 'bed' : el.kind === 'parking' ? 'sofa' : el.kind === 'garden' ? 'plant' : el.kind === 'kitchen' ? 'kitchen' : el.kind === 'dining' ? 'dining' : el.kind === 'living' ? 'sofa' : el.kind === 'staircase' ? 'wall' : 'bed',
            iconKey: el.kind === 'living' ? 'Sofa' : el.kind === 'kitchen' ? 'Kitchen' : el.kind === 'dining' ? 'DiningTable' : el.kind === 'parking' ? 'Sofa' : el.kind === 'garden' ? 'Plant' : 'Bed',
            label: el.name,
            x: el.x,
            y: el.y,
            rotation: el.rotation || 0,
            color: el.stroke || '#1e293b',
        }))

    return (
        <div className="planner-page" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fffaf3 0%, #ffffff 40%, #f8fafc 100%)', color: '#0f172a' }}>
            <style>{`
                .planner-shell { display: grid; grid-template-columns: 320px 1fr 320px; gap: 18px; padding: 18px; }
                .planner-panel { background: rgba(255,255,255,0.92); border: 1px solid rgba(226,232,240,0.95); border-radius: 22px; box-shadow: 0 18px 40px rgba(15,23,42,0.08); backdrop-filter: blur(16px); }
                .planner-toolbar-btn { border: 1px solid #e5e7eb; background: white; border-radius: 12px; padding: 10px 12px; font-weight: 800; cursor: pointer; }
                .planner-toolbar-btn.active { background: #fff7ed; border-color: #fb923c; color: #ea580c; }
                .planner-input { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 10px 12px; font-size: 14px; outline: none; }
                .planner-input:focus { border-color: #fb923c; box-shadow: 0 0 0 3px rgba(251,146,60,0.15); }
                .planner-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: #fff7ed; color: #9a3412; font-weight: 800; font-size: 12px; }
                .planner-floor-tab { border: 1px solid #e5e7eb; background: white; padding: 8px 12px; border-radius: 12px; cursor: pointer; font-weight: 800; }
                .planner-floor-tab.active { background: #0f172a; color: white; }
                .planner-status { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; border-top: 1px solid #e2e8f0; background: #fff; border-radius: 0 0 22px 22px; font-size: 12px; font-weight: 700; color: #475569; }
                .planner-helper { font-size: 12px; color: #64748b; line-height: 1.6; }
                @media (max-width: 1200px) {
                    .planner-shell { grid-template-columns: 1fr; }
                }
            `}</style>

            <Toast toasts={toasts} removeToast={removeToast} />

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #eef2f7', background: 'rgba(255,255,255,0.85)', position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(12px)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>AI Architecture Planner</h1>
                        <span className="planner-chip">BharatHome Value</span>
                    </div>
                    <p style={{ margin: '6px 0 0', color: '#64748b' }}>Design, plan and customize your dream home.</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <select className="planner-input" style={{ width: 220 }} value={projectId || ''} onChange={(e) => loadProject(e.target.value)}>
                        <option value="">Open saved project</option>
                        {projectList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <button className="planner-toolbar-btn" onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
                </div>
            </header>

            <div className="planner-shell">
                <aside className="planner-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className={`planner-toolbar-btn ${mode === 'ai' ? 'active' : ''}`} onClick={() => setMode('ai')}>AI PLAN</button>
                        <button className={`planner-toolbar-btn ${mode === 'manual' ? 'active' : ''}`} onClick={() => setMode('manual')}>DESIGN YOURSELF</button>
                    </div>

                    {mode === 'ai' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div>
                                <label className="planner-helper">Project name</label>
                                <input className="planner-input" value={aiRequest.projectName} onChange={(e) => setAiRequest(prev => ({ ...prev, projectName: e.target.value }))} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div><label className="planner-helper">Plot width</label><input className="planner-input" type="number" value={aiRequest.plotWidth} onChange={(e) => setAiRequest(prev => ({ ...prev, plotWidth: Number(e.target.value) }))} /></div>
                                <div><label className="planner-helper">Plot length</label><input className="planner-input" type="number" value={aiRequest.plotLength} onChange={(e) => setAiRequest(prev => ({ ...prev, plotLength: Number(e.target.value) }))} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div><label className="planner-helper">Floors</label><input className="planner-input" type="number" min="1" max="4" value={aiRequest.floors} onChange={(e) => setAiRequest(prev => ({ ...prev, floors: Number(e.target.value) }))} /></div>
                                <div><label className="planner-helper">Bedrooms</label><input className="planner-input" type="number" min="1" value={aiRequest.bedrooms} onChange={(e) => setAiRequest(prev => ({ ...prev, bedrooms: Number(e.target.value) }))} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div><label className="planner-helper">Bathrooms</label><input className="planner-input" type="number" min="1" value={aiRequest.bathrooms} onChange={(e) => setAiRequest(prev => ({ ...prev, bathrooms: Number(e.target.value) }))} /></div>
                                <div><label className="planner-helper">Kitchen</label><input className="planner-input" type="number" min="1" value={aiRequest.kitchen} onChange={(e) => setAiRequest(prev => ({ ...prev, kitchen: Number(e.target.value) }))} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div><label className="planner-helper">Living</label><input className="planner-input" type="number" min="1" value={aiRequest.living} onChange={(e) => setAiRequest(prev => ({ ...prev, living: Number(e.target.value) }))} /></div>
                                <div><label className="planner-helper">Dining</label><input className="planner-input" type="number" min="0" value={aiRequest.dining} onChange={(e) => setAiRequest(prev => ({ ...prev, dining: Number(e.target.value) }))} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div><label className="planner-helper">Road direction</label><select className="planner-input" value={aiRequest.roadDirection} onChange={(e) => setAiRequest(prev => ({ ...prev, roadDirection: e.target.value }))}><option>North</option><option>South</option><option>East</option><option>West</option></select></div>
                                <div><label className="planner-helper">Entrance direction</label><select className="planner-input" value={aiRequest.entranceDirection} onChange={(e) => setAiRequest(prev => ({ ...prev, entranceDirection: e.target.value }))}><option>East</option><option>West</option><option>North</option><option>South</option></select></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div><label className="planner-helper">Style</label><input className="planner-input" value={aiRequest.style} onChange={(e) => setAiRequest(prev => ({ ...prev, style: e.target.value }))} /></div>
                                <div><label className="planner-helper">Budget</label><input className="planner-input" type="number" value={aiRequest.budget} onChange={(e) => setAiRequest(prev => ({ ...prev, budget: Number(e.target.value) }))} /></div>
                            </div>
                            <div><label className="planner-helper">Preferred room sizes</label><input className="planner-input" value={aiRequest.preferredRoomSizes} onChange={(e) => setAiRequest(prev => ({ ...prev, preferredRoomSizes: e.target.value }))} /></div>
                            <div><label className="planner-helper">Special requirements</label><textarea className="planner-input" rows={4} value={aiRequest.specialRequirements} onChange={(e) => setAiRequest(prev => ({ ...prev, specialRequirements: e.target.value }))} /></div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
                                <input type="checkbox" checked={aiRequest.vastu} onChange={(e) => setAiRequest(prev => ({ ...prev, vastu: e.target.checked }))} /> Vastu mode
                            </label>
                            <button className="planner-toolbar-btn" style={{ background: '#ea580c', color: 'white', borderColor: '#ea580c' }} onClick={handleGenerateAI}>Generate AI Floor Plan</button>
                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                                <p className="planner-helper" style={{ marginTop: 0 }}>What this AI does now:</p>
                                <ul className="planner-helper" style={{ paddingLeft: 18, margin: 0 }}>
                                    <li>Builds a structured 2D floor plan from your requirements.</li>
                                    <li>Places rooms, doors, windows, staircase, parking and furniture.</li>
                                    <li>Keeps the output editable on the canvas.</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="planner-helper">Toolbar tools</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {TOOLBAR_TOOLS.map(tool => (
                                    <button key={tool} className={`planner-toolbar-btn ${activeTool === tool ? 'active' : ''}`} onClick={() => setActiveTool(tool)}>
                                        {tool.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div><label className="planner-helper">Project name</label><input className="planner-input" value={projectName} onChange={(e) => setProjectName(e.target.value)} /></div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div><label className="planner-helper">Plot width</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(project.plot.width)} onChange={(e) => { const next = clone(project); next.plot.width = unitConfig[unit].toFt(e.target.value); next.meta.requirements.plotWidth = next.plot.width; setProject(next) }} /></div>
                                    <div><label className="planner-helper">Plot length</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(project.plot.length)} onChange={(e) => { const next = clone(project); next.plot.length = unitConfig[unit].toFt(e.target.value); next.meta.requirements.plotLength = next.plot.length; setProject(next) }} /></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div><label className="planner-helper">Unit</label><select className="planner-input" value={unit} onChange={(e) => setUnit(e.target.value)}><option value="ft">Feet / Inches</option><option value="m">Meters</option><option value="cm">Centimeters</option><option value="mm">Millimeters</option></select></div>
                                    <div><label className="planner-helper">Scale</label><select className="planner-input" value={project.meta.scale} onChange={(e) => updateProject(current => { current.meta.scale = e.target.value; return current })}><option>1:50</option><option>1:100</option><option>1:200</option></select></div>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                <main className="planner-panel" style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: 14, borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                        <button className={`planner-toolbar-btn ${activeTool === 'select' ? 'active' : ''}`} onClick={() => setActiveTool('select')}>SELECT</button>
                        <button className="planner-toolbar-btn" onClick={handleUndo} disabled={history.length === 0}>Undo</button>
                        <button className="planner-toolbar-btn" onClick={handleRedo} disabled={future.length === 0}>Redo</button>
                        <button className="planner-toolbar-btn" onClick={() => saveCurrentProject(false)}>Save</button>
                        <button className="planner-toolbar-btn" onClick={() => saveCurrentProject(true)}>Save As</button>
                        <button className="planner-toolbar-btn" onClick={handleSaveVersion}>Save Version</button>
                        <button className="planner-toolbar-btn" onClick={() => setMode(mode === 'ai' ? 'manual' : 'ai')}>AI / Manual</button>
                        <button className="planner-toolbar-btn" onClick={() => setGridOn(v => !v)}>{gridOn ? 'Grid On' : 'Grid Off'}</button>
                        <button className="planner-toolbar-btn" onClick={() => setSnapOn(v => !v)}>{snapOn ? 'Snap On' : 'Snap Off'}</button>
                        <button className="planner-toolbar-btn" onClick={() => setMeasureOn(v => !v)}>{measureOn ? 'Measure On' : 'Measure Off'}</button>
                        <button className="planner-toolbar-btn" onClick={() => setViewMode(v => (v === '2d' ? '3d' : '2d'))}>{viewMode === '2d' ? '3D View' : '2D Plan'}</button>
                        <button className="planner-toolbar-btn" onClick={() => setZoom(z => clamp(z + 0.1, 0.5, 2))}>Zoom In</button>
                        <button className="planner-toolbar-btn" onClick={() => setZoom(z => clamp(z - 0.1, 0.5, 2))}>Zoom Out</button>
                        <button className="planner-toolbar-btn" onClick={() => setZoom(1)}>Fit to Screen</button>
                        <button className="planner-toolbar-btn" onClick={() => setAiPrompt('Create a Vastu-friendly version.')}>Vastu</button>
                        <button className="planner-toolbar-btn" onClick={handleExportPng}>Export PNG</button>
                        <button className="planner-toolbar-btn" onClick={handlePrint}>Print</button>
                    </div>

                    <div style={{ display: 'flex', gap: 8, padding: '12px 14px', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', background: '#fafafa' }}>
                        {project.floors.map(floor => (
                            <button key={floor.id} className={`planner-floor-tab ${selectedFloorId === floor.id ? 'active' : ''}`} onClick={() => setSelectedFloorId(floor.id)}>{floor.name}</button>
                        ))}
                        <button className="planner-floor-tab" onClick={handleAddFloor}>+ Add Floor</button>
                        <button className="planner-floor-tab" onClick={handleCopyFloor}>Copy Floor</button>
                    </div>

                    <div ref={canvasWrapRef} style={{ position: 'relative', width: '100%', height: 620, overflow: 'hidden', background: viewMode === '3d' ? '#0f172a' : '#f8fafc' }}>
                        {viewMode === '3d' ? (
                            <FloorPlanner3DViewer
                                items={previewItems}
                                roomLeft={0}
                                roomTop={0}
                                roomPxW={project.plot.width}
                                roomPxH={project.plot.length}
                                roomWidthFt={project.plot.width}
                                roomHeightFt={project.plot.length}
                            />
                        ) : (
                            <Stage
                                ref={stageRef}
                                width={canvasWidth}
                                height={canvasHeight}
                                x={stageOffset.x}
                                y={stageOffset.y}
                                scaleX={scale}
                                scaleY={scale}
                                draggable={activeTool === 'select'}
                                onMouseDown={handleStageMouseDown}
                                onMouseMove={handleStageMouseMove}
                                onMouseUp={handleStageMouseUp}
                                onDragEnd={(e) => setStageOffset({ x: e.target.x(), y: e.target.y() })}
                                onWheel={(e) => {
                                    e.evt.preventDefault()
                                    const stage = e.target.getStage()
                                    const pointer = stage.getPointerPosition()
                                    const oldScale = scale
                                    const scaleBy = 1.05
                                    const nextZoom = e.evt.deltaY < 0 ? clamp(zoom * scaleBy, 0.5, 2) : clamp(zoom / scaleBy, 0.5, 2)
                                    const mousePointTo = { x: (pointer.x - stageOffset.x) / oldScale, y: (pointer.y - stageOffset.y) / oldScale }
                                    const nextScale = baseScale * nextZoom
                                    setZoom(nextZoom)
                                    setStageOffset({ x: pointer.x - mousePointTo.x * nextScale, y: pointer.y - mousePointTo.y * nextScale })
                                }}
                            >
                                <Layer>
                                    {gridOn && Array.from({ length: 80 }).map((_, i) => (
                                        <Line key={`gv-${i}`} points={[i, 0, i, project.plot.length]} stroke="#e2e8f0" strokeWidth={0.04} listening={false} />
                                    ))}
                                    {gridOn && Array.from({ length: 80 }).map((_, i) => (
                                        <Line key={`gh-${i}`} points={[0, i, project.plot.width, i]} stroke="#e2e8f0" strokeWidth={0.04} listening={false} />
                                    ))}

                                    <Rect x={0} y={0} width={project.plot.width} height={project.plot.length} fill={viewMode === '3d' ? '#0f172a' : '#fffdf8'} stroke="#0f172a" strokeWidth={0.15} dash={[0]} listening={false} />
                                    <Rect x={project.plot.leftSetback} y={project.plot.frontSetback} width={Math.max(0, project.plot.width - project.plot.leftSetback - project.plot.rightSetback)} height={Math.max(0, project.plot.length - project.plot.frontSetback - project.plot.rearSetback)} fill="rgba(251, 146, 60, 0.05)" stroke="#fb923c" strokeWidth={0.08} dash={[0.4, 0.4]} listening={false} />
                                    <KonvaText x={0.5} y={-1.6} text={`Project: ${projectName}`} fontSize={0.5} fill="#0f172a" fontStyle="bold" listening={false} />
                                    <KonvaText x={0.5} y={project.plot.length + 0.7} text={`Plot: ${formatLength(project.plot.width, unit)} × ${formatLength(project.plot.length, unit)}`} fontSize={0.42} fill="#475569" listening={false} />
                                    <KonvaText x={project.plot.width - 8} y={-1.6} text="North" fontSize={0.42} fill="#475569" listening={false} />

                                    {floorElements.map((element) => (
                                        <PlannerObject
                                            key={element.id}
                                            element={element}
                                            isSelected={selectedElementId === element.id}
                                            onSelect={setSelectedElementId}
                                            onDragEnd={(e) => handleDragEnd(element.id, e)}
                                            onTransformEnd={() => handleTransformEnd(element.id)}
                                            nodeRef={(node) => { if (node) nodeRefs.current[element.id] = node }}
                                            scale={scale}
                                        />
                                    ))}

                                    {draftRect && (() => {
                                        const x = Math.min(draftRect.start.x, draftRect.current.x)
                                        const y = Math.min(draftRect.start.y, draftRect.current.y)
                                        const width = Math.abs(draftRect.current.x - draftRect.start.x)
                                        const height = Math.abs(draftRect.current.y - draftRect.start.y)
                                        return (
                                            <Rect
                                                x={x}
                                                y={y}
                                                width={Math.max(0.8, width)}
                                                height={Math.max(0.8, height)}
                                                fill="rgba(251,146,60,0.18)"
                                                stroke="#ea580c"
                                                strokeDashArray={[0.4, 0.35]}
                                                strokeWidth={0.1}
                                            />
                                        )
                                    })()}

                                    <Transformer
                                        ref={transformerRef}
                                        rotateEnabled
                                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
                                        borderStroke="#ea580c"
                                        anchorFill="#ea580c"
                                        anchorStroke="#ea580c"
                                        anchorSize={0.4}
                                        boundBoxFunc={(oldBox, newBox) => {
                                            if (newBox.width < 0.6 || newBox.height < 0.6) return oldBox
                                            return newBox
                                        }}
                                    />
                                </Layer>
                            </Stage>
                        )}
                    </div>

                    <div className="planner-status">
                        <span>Zoom: {Math.round(zoom * 100)}%</span>
                        <span>Grid: {gridOn ? 'On' : 'Off'}</span>
                        <span>Snap: {snapOn ? 'On' : 'Off'}</span>
                        <span>Units: {unit.toUpperCase()}</span>
                        <span>Plot Area: {displayArea(projectSummary.plotArea, unit)}</span>
                    </div>
                </main>

                <aside className="planner-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Properties</h3>
                        <span className="planner-chip">{selectedElement ? selectedElement.kind.toUpperCase() : 'PROJECT'}</span>
                    </div>

                    {selectedElement ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div><label className="planner-helper">Name</label><input className="planner-input" value={selectedElement.name || ''} onChange={(e) => handleUpdateSelected({ name: e.target.value })} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div><label className="planner-helper">X</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(selectedElement.x).toFixed(2)} onChange={(e) => handleUpdateSelected({ x: unitConfig[unit].toFt(e.target.value) })} /></div>
                                <div><label className="planner-helper">Y</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(selectedElement.y).toFixed(2)} onChange={(e) => handleUpdateSelected({ y: unitConfig[unit].toFt(e.target.value) })} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div><label className="planner-helper">Width</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(selectedElement.width).toFixed(2)} onChange={(e) => handleUpdateSelected({ width: unitConfig[unit].toFt(e.target.value) })} /></div>
                                <div><label className="planner-helper">Height</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(selectedElement.height).toFixed(2)} onChange={(e) => handleUpdateSelected({ height: unitConfig[unit].toFt(e.target.value) })} /></div>
                            </div>
                            <div><label className="planner-helper">Rotation</label><input className="planner-input" type="number" value={selectedElement.rotation || 0} onChange={(e) => handleUpdateSelected({ rotation: Number(e.target.value) })} /></div>
                            <div><label className="planner-helper">Fill</label><input className="planner-input" value={selectedElement.fill || ''} onChange={(e) => handleUpdateSelected({ fill: e.target.value })} /></div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button className="planner-toolbar-btn" onClick={handleDuplicateSelected}>Duplicate</button>
                                <button className="planner-toolbar-btn" onClick={handleDeleteSelected}>Delete</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div>
                                <div className="planner-helper">Plot dimensions</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div><label className="planner-helper">Width</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(project.plot.width).toFixed(2)} onChange={(e) => { const next = clone(project); next.plot.width = unitConfig[unit].toFt(e.target.value); setProject(next) }} /></div>
                                    <div><label className="planner-helper">Length</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(project.plot.length).toFixed(2)} onChange={(e) => { const next = clone(project); next.plot.length = unitConfig[unit].toFt(e.target.value); setProject(next) }} /></div>
                                </div>
                            </div>
                            <div><label className="planner-helper">Front setback</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(project.plot.frontSetback).toFixed(2)} onChange={(e) => { const next = clone(project); next.plot.frontSetback = unitConfig[unit].toFt(e.target.value); setProject(next) }} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div><label className="planner-helper">Left setback</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(project.plot.leftSetback).toFixed(2)} onChange={(e) => { const next = clone(project); next.plot.leftSetback = unitConfig[unit].toFt(e.target.value); setProject(next) }} /></div>
                                <div><label className="planner-helper">Right setback</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(project.plot.rightSetback).toFixed(2)} onChange={(e) => { const next = clone(project); next.plot.rightSetback = unitConfig[unit].toFt(e.target.value); setProject(next) }} /></div>
                            </div>
                            <div><label className="planner-helper">Rear setback</label><input className="planner-input" type="number" value={unitConfig[unit].fromFt(project.plot.rearSetback).toFixed(2)} onChange={(e) => { const next = clone(project); next.plot.rearSetback = unitConfig[unit].toFt(e.target.value); setProject(next) }} /></div>
                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                                <div className="planner-helper">AI modify prompt</div>
                                <textarea className="planner-input" rows={4} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Add one more bedroom. Make the kitchen bigger. Add parking for 2 cars." />
                                <button className="planner-toolbar-btn" style={{ width: '100%', marginTop: 10, background: '#ea580c', color: 'white', borderColor: '#ea580c' }} onClick={handleAiModify}>Ask AI to Modify</button>
                            </div>
                        </div>
                    )}

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                        <h4 style={{ margin: '0 0 10px', fontSize: 16 }}>Project Summary</h4>
                        <div className="planner-helper" style={{ display: 'grid', gap: 6 }}>
                            <div>Plot area: {displayArea(projectSummary.plotArea, unit)}</div>
                            <div>Buildable area: {displayArea(projectSummary.buildableArea, unit)}</div>
                            <div>Floors: {project.floors.length}</div>
                            <div>Rooms on current floor: {projectSummary.roomCount}</div>
                            <div>Furniture items: {projectSummary.furnitureCount}</div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                        <h4 style={{ margin: '0 0 10px', fontSize: 16 }}>Versions</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflow: 'auto' }}>
                            {project.versions?.length ? project.versions.map(version => (
                                <button key={version.id} className="planner-toolbar-btn" onClick={() => handleRestoreVersion(version.snapshot)} style={{ textAlign: 'left' }}>{version.label}</button>
                            )) : <div className="planner-helper">No versions saved yet.</div>}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                        <h4 style={{ margin: '0 0 10px', fontSize: 16 }}>Safe Construction Note</h4>
                        <p className="planner-helper" style={{ marginTop: 0 }}>
                            AI-generated plans here are preliminary design concepts. Review them with a qualified architect or structural engineer before construction.
                        </p>
                    </div>
                </aside>
            </div>

            <div style={{ padding: '0 18px 24px' }}>
                <div className="planner-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <input className="planner-input" style={{ flex: 1, minWidth: 240 }} value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project name" />
                        <button className="planner-toolbar-btn" onClick={() => persistCurrentProject({ ...project, name: projectName, id: projectId || uid('project') })}>Quick Save</button>
                        <button className="planner-toolbar-btn" onClick={() => window.localStorage.removeItem(`${STORAGE_KEY}:${userEmail}`) || setProjectList([])}>Clear Saved</button>
                        <button className="planner-toolbar-btn" onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
