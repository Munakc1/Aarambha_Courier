
import type { Request, Response, NextFunction } from "express";
import TrackingShipment from "../models/TrackingShipment.js";

export const createTrackingShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      trackingNumber,
      status,
      serviceType,
      destination,
      events,
    } = req.body;

    if (
      typeof trackingNumber !== "string" ||
      !/^[A-Z0-9-]{3,50}$/i.test(trackingNumber.trim())
    ) {
      res.status(400).json({
        success: false,
        message: "A valid trackingNumber is required.",
      });
      return;
    }

    if (
      typeof serviceType !== "string" ||
      !serviceType.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "serviceType is required.",
      });
      return;
    }

    if (
      events !== undefined &&
      (!Array.isArray(events) ||
        events.some(
          (event: unknown) =>
            !event ||
            typeof event !== "object" ||
            typeof (event as { status?: unknown }).status !== "string" ||
            typeof (event as { description?: unknown }).description !== "string" ||
            typeof (event as { occurredAt?: unknown }).occurredAt !== "string" ||
            Number.isNaN(
              Date.parse((event as { occurredAt: string }).occurredAt)
            )
        ))
    ) {
      res.status(400).json({
        success: false,
        message: "Each event must have a status, description, and valid occurredAt date.",
      });
      return;
    }

    const normalizedTrackingNumber = trackingNumber.trim().toUpperCase();

    const existingShipment = await TrackingShipment.findOne({
      trackingNumber: normalizedTrackingNumber,
    }).exec();

    if (existingShipment) {
      res.status(409).json({
        success: false,
        message: "This tracking number already exists.",
      });
      return;
    }

    const shipment = await TrackingShipment.create({
      trackingNumber: normalizedTrackingNumber,
      status: typeof status === "string" ? status : "CREATED",
      serviceType: serviceType.trim(),
      destination:
        typeof destination === "string" ? destination.trim() : null,
      events: (events ?? []).map(
        (event: {
          status: string;
          description: string;
          location?: string;
          occurredAt: string;
        }) => ({
          status: event.status,
          description: event.description,
          location: event.location ?? null,
          occurredAt: new Date(event.occurredAt),
        })
      ),
    });

    res.status(201).json({
      success: true,
      message: "Shipment created successfully.",
      data: {
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        serviceType: shipment.serviceType,
        destination: shipment.destination,
        events: shipment.events,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTracking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trackingNumber = String(req.params.trackingNumber ?? "")
      .trim()
      .toUpperCase();

    if (
      trackingNumber.length < 3 ||
      trackingNumber.length > 50 ||
      !/^[A-Z0-9-]+$/.test(trackingNumber)
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid tracking number.",
      });
      return;
    }

    const shipment = await TrackingShipment.findOne({
      trackingNumber,
    }).exec();

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found. Please check your tracking number.",
      });
      return;
    }

    const events = [...shipment.events].sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() -
        new Date(b.occurredAt).getTime()
    );

    res.status(200).json({
      success: true,
      data: {
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        serviceType: shipment.serviceType,
        destination: shipment.destination ?? null,
        events: events.map((event) => ({
          status: event.status,
          description: event.description,
          location: event.location ?? null,
          occurredAt: event.occurredAt,
        })),
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
