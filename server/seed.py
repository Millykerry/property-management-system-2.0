from config import app, db
from models import User, Property, Tenant, RentPayment
from datetime import date


with app.app_context():
    db.drop_all()
    db.create_all()

    # Seed admin user
    admin = User(username="admin", email="admin@propertyhub.com")
    admin.set_password("Admin@1234")
    db.session.add(admin)
    db.session.flush()

    # Seed properties
    p1 = Property(
        name="Sunset Apartments",
        address="123 Sunset Blvd",
        city="Nairobi",
        state="Nairobi County",
        property_type="apartment",
        num_units=12,
        monthly_rent=25000,
        description="Modern apartments near CBD",
        user_id=admin.id,
    )
    p2 = Property(
        name="Green Valley Homes",
        address="456 Green Lane",
        city="Nakuru",
        state="Nakuru County",
        property_type="house",
        num_units=5,
        monthly_rent=15000,
        description="Quiet family homes",
        user_id=admin.id,
    )
    db.session.add_all([p1, p2])
    db.session.flush()

    # Seed tenants
    t1 = Tenant(first_name="James", last_name="Mwangi", email="james@email.com", phone="+254700111222", national_id="12345678")
    t2 = Tenant(first_name="Grace", last_name="Njeri", email="grace@email.com", phone="+254700333444", national_id="23456789")
    t3 = Tenant(first_name="Brian", last_name="Otieno", email="brian@email.com", phone="+254700555666", national_id="34567890")
    db.session.add_all([t1, t2, t3])
    db.session.flush()

    # Seed rent payments
    rp1 = RentPayment(tenant_id=t1.id, property_id=p1.id, amount_paid=25000, payment_date=date(2026, 3, 1), due_date=date(2026, 3, 5), status="paid", payment_method="mpesa")
    rp2 = RentPayment(tenant_id=t2.id, property_id=p1.id, amount_paid=20000, payment_date=date(2026, 3, 3), due_date=date(2026, 3, 5), status="partial", payment_method="bank_transfer", notes="Pending 5000")
    rp3 = RentPayment(tenant_id=t3.id, property_id=p2.id, amount_paid=15000, payment_date=date(2026, 2, 10), due_date=date(2026, 2, 5), status="overdue", payment_method="cash")
    db.session.add_all([rp1, rp2, rp3])
    db.session.commit()

    print("Database seeded successfully!")
    print("Login: admin@propertyhub.com / Admin@1234")
