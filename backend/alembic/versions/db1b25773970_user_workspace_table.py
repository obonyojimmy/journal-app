"""user-workspace table

Revision ID: db1b25773970
Revises: 
Create Date: 2022-07-06 20:59:41.669739

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func, text, expression
from sqlalchemy.dialects.postgresql import UUID, ENUM

# revision identifiers, used by Alembic.
revision = 'db1b25773970'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    connection = op.get_bind()
    ## add uuid-ossp for auto-generation of uuids 
    connection.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'), execution_options={'autocommit':True})

    op.create_table(
        "user",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, unique=True, nullable=False), # *(required) , cognito user-id
        sa.Column("email", sa.String(), unique=True, nullable=False), # *(required)
        sa.Column("username", sa.String(), unique=True, nullable=False), # *(required)
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_table(
        "journal",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, unique=True, nullable=False, server_default=text("uuid_generate_v4()")), # *(required)
        sa.Column("title", sa.String(), nullable=False), # *(required)
        sa.Column("user_id", UUID(as_uuid=True), nullable=False, comment="user_id (creator) of this journal"), # *(required)
        sa.Column("content", sa.String(), nullable=True),
        sa.Column("categories", sa.ARRAY(sa.String()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade():
    op.drop_table("user")
